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
		this.config = this.defaultConfiguration;

		if (options) {
			this.applyConfig(options, false);
		} else {
			this.findConfig();
		}
	}

	private defaultConfiguration: Configuration = {
		collector: {
			use: "entryPoint",
		},
		volume: 3,
		bubbleHooks: false,
		colors: true,
		dev: false,
	};

	public applyConfig = (options: Configuration, onTheFly: boolean) => {
		if (options) {
			this.validateConfig(options, onTheFly);
			if (!onTheFly) {
				this.requireRequires(options);
			}
			this.config = Object.assign({}, this.defaultConfiguration, options);
		}
	};

	private findConfig = () => {
		const pathToConfig = path.join(process.env["PWD"], "petzl.config.js");
		const configExists = fs.existsSync(pathToConfig);
		if (configExists) {
			const userConfigFile = require(pathToConfig);
			this.applyConfig(userConfigFile, false);
		}
	};

	private requireRequires = (config: Partial<Configuration>) => {
		if (!config.require) return;
		for (const requiredModule of config.require) {
			try {
				// synchronously require modules
				require(requiredModule);
			} catch (err) {
				if (err.code && err.code === "MODULE_NOT_FOUND") {
					throw new ConfigError(
						"require",
						`Could not find module ${requiredModule}`
					);
				} else {
					throw err;
				}
			}
		}
	};

	public validateConfig = (
		config: Partial<Configuration>,
		onTheFly: boolean
	) => {
		const throwOnTheFly = (optionName: keyof Configuration) => {
			throw new ConfigError(
				optionName,
				`Cannot configure this option on the fly.`
			);
		};

		if (!config) return;

		// dev
		if (config.dev) {
			if (!config.dev.logger) {
				if (typeof config.dev !== "object") {
					throw new ConfigError(
						"dev",
						"dev can either be set to 'false' or DevConfiguration"
					);
				} else {
					throw new ConfigError(
						"dev",
						"dev must contain the property logger"
					);
				}
			}
		}

		// require
		if (config.require) {
			if (onTheFly) {
				throwOnTheFly("require");
			} else {
				for (const requiredModule of config.require) {
					if (typeof requiredModule !== "string") {
						throw new ConfigError(
							`require[${requiredModule}]`,
							"Must be a string"
						);
					}
				}
			}
		}

		// colors
		if (config.colors) {
			if (typeof config.colors !== "boolean") {
				throw new ConfigError("colors", "Must be a boolean");
			}
		}

		// volume
		if (config.volume) {
			if (typeof config.volume !== "number") {
				throw new ConfigError("volume", "Must be a number");
			}
		}

		// bubbleHooks
		if (config.bubbleHooks) {
			if (typeof config.bubbleHooks !== "boolean") {
				throw new ConfigError("bubbleHooks", "Must be a boolean");
			}
		}

		// collector
		if (config.collector && onTheFly) {
			throwOnTheFly("collector");
		}

		const collectorConfig = config.collector;

		if (isMatchExtensionsConfig(collectorConfig)) {
			// validate matchExtensions config
			if (collectorConfig.root) {
				const rootExists = fs.existsSync(collectorConfig.root);
				if (!rootExists) {
					throw new ConfigError(
						"collector.root",
						`directory ${collectorConfig.root} does not exist`
					);
				}
			} else {
				throw new ConfigError(
					"collector.root",
					"is required to use the 'matchExtensions' collector"
				);
			}
			if (!collectorConfig.match) {
				throw new ConfigError(
					"collector.match",
					"is required to use the 'matchExtensions' collector"
				);
			} else {
				if (!Array.isArray(collectorConfig.match)) {
					throw new ConfigError("collector.root", "must be an Array");
				} else {
					for (const matcher of collectorConfig.match) {
						if (matcher.charAt(0) !== ".") {
							throw new ConfigError(
								"collector.match",
								`: Matcher should begin with '.', but got '${matcher}'`
							);
						}
					}
				}
			}
		} else if (isEntryPointConfig(collectorConfig)) {
			// validate
		} else if (isSequencerConfig(collectorConfig)) {
			// validate sequencer config
			//TODO: Validate 'ignore' option
			if (!collectorConfig.sequence) {
				throw new ConfigError(
					"collector.sequence",
					"is required to use the 'sequencer' collector"
				);
			} else {
				if (!Array.isArray(collectorConfig.sequence)) {
					throw new ConfigError(
						"collector.sequence",
						"is required to be an Array"
					);
				} else {
					collectorConfig.sequence.forEach((fileOrDir) => {
						const exists = fs.existsSync(fileOrDir);
						if (!exists) {
							throw new ConfigError(
								"collector.include",
								`path in sequence does not exist -> "${fileOrDir}"`
							);
						}
					});
				}
			}
		} else {
		}
	};
}
