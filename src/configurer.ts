import {
	ConfigError,
	Configuration,
	isEntryPointConfig,
	isMatchExtensionsConfig,
	isSequencerConfig,
} from "./types";
import fs from "fs";
import path from "path";

export default class Configurer {
	public config: Configuration;

	constructor(options?: Configuration) {
		if (options) {
			this.mergeConfigWithDefault(options);
		} else {
			this.findConfig();
		}
	}

	private defaultConfiguration: Configuration = {
		runner: {
			use: "entryPoint",
		},
		volume: 3,
		bubbleHooks: false,
		colors: true,
		dev: false,
	};

	private mergeConfigWithDefault = (options?: Configuration) => {
		if (options) {
			this.validateConfig(options);
			this.config = Object.assign({}, this.defaultConfiguration, options);
		} else {
			this.config = this.defaultConfiguration;
		}
	};

	private findConfig = () => {
		const pathToConfig = path.join(process.env["PWD"], "petzl.config.js");
		const configExists = fs.existsSync(pathToConfig);
		if (configExists) {
			const userConfigFile = require(pathToConfig);
			this.mergeConfigWithDefault(userConfigFile);
		} else {
			this.mergeConfigWithDefault();
		}
	};

	private validateConfig = (config: Partial<Configuration>) => {
		if (!config) return;
		if (config.dev && config.dev !== false) {
			if (config.dev === true) {
				throw new ConfigError(
					"dev",
					"dev can either be set to 'false' or DevConfiguration"
				);
			}
			//TODO: VALIDATE DEV OPTIONS
		}

		const runnerConfig = config.runner;

		if (isMatchExtensionsConfig(runnerConfig)) {
			// validate matchExtensions config
			if (runnerConfig.root) {
				const rootExists = fs.existsSync(runnerConfig.root);
				if (!rootExists) {
					throw new ConfigError(
						"runner.root",
						`directory ${runnerConfig.root} does not exist`
					);
				}
			} else {
				throw new ConfigError(
					"runner.root",
					"is required to use the 'matchExtensions' runner"
				);
			}
			if (!runnerConfig.match) {
				throw new ConfigError(
					"runner.match",
					"is required to use the 'matchExtensions' runner"
				);
			} else {
				if (!Array.isArray(runnerConfig.match)) {
					throw new ConfigError("runner.root", "must be an Array");
				} else {
					for (const matcher of runnerConfig.match) {
						if (matcher.charAt(0) !== ".") {
							throw new ConfigError(
								"runner.match",
								`: Matcher should begin with '.', but got '${matcher}'`
							);
						}
					}
				}
			}
		} else if (isEntryPointConfig(runnerConfig)) {
			// validate
		} else if (isSequencerConfig(runnerConfig)) {
			// validate sequencer config
			//TODO: Validate 'ignore' option
			if (!runnerConfig.sequence) {
				throw new ConfigError(
					"runner.sequence",
					"is required to use the 'sequencer' runner"
				);
			} else {
				if (!Array.isArray(runnerConfig.sequence)) {
					throw new ConfigError(
						"runner.sequence",
						"is required to be an Array"
					);
				} else {
					runnerConfig.sequence.forEach((fileOrDir) => {
						const exists = fs.existsSync(fileOrDir);
						if (!exists) {
							throw new ConfigError(
								"runner.include",
								`path in sequence does not exist -> "${fileOrDir}"`
							);
						}
					});
				}
			}
		}
	};
}
