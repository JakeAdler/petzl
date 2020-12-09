import {
	ConfigError,
	Configuration,
	isEntryPointConfig,
	isMatchExtensionsConfig,
	isSequencerConfig,
} from "./types";
import fs from "fs";
import path from "path";
import assert, { AssertionError } from "assert";
import { registerProcessEventListeners } from "./utils";

export default class Configurer {
	public config: Configuration;

	constructor(options?: Partial<Configuration>) {
		this.config = this.defaultConfiguration;

		registerProcessEventListeners(options ? options.dev : this.config.dev);

		if (options) {
			this.applyConfig(options);
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
		printFileNames: true,
		colors: true,
		dev: false,
	};

	public applyConfig = (options: Partial<Configuration>) => {
		this.validateConfig(options);
		this.requireRequires(options);
		this.config = Object.assign({}, this.defaultConfiguration, options);
	};

	private findConfig = () => {
		const pathToConfig = path.join(process.env["PWD"], "quyz.config.js");
		const configExists = fs.existsSync(pathToConfig);
		if (configExists) {
			const userConfigFile = require(pathToConfig);
			this.applyConfig(userConfigFile);
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

	public validateConfig = (config: Partial<Configuration>) => {
		if (!config) return;

		type Type = "string" | "boolean" | "number" | "array";

		const isType = (optionName: string, val: any, type: Type) => {
			try {
				if (val) {
					if (type === "array" && !Array.isArray(val)) {
						throw new AssertionError({
							message: "",
							expected: "array",
							actual: typeof val,
						});
					}
					assert.strictEqual(typeof val, type);
				}
			} catch (err) {
				throw new ConfigError(
					optionName,
					`Expected option to be of type ${type} but got '${err.actual}'`
				);
			}
		};

		const isRequired = (optionName: string, val: any, message?: string) => {
			if (val === undefined || val === null) {
				throw new ConfigError(
					optionName,
					message ? message : "option is required"
				);
			}
		};

		// require
		config.require &&
			config.require.forEach((req) => {
				isType("require", req, "string");
			});

		// colors
		isType("colors", config.colors, "boolean");

		// volume
		isType("volume", config.colors, "number");

		// bubbleHooks
		isType("bubbleHooks", config.bubbleHooks, "boolean");

		// collector
		const collectorConfig: any = config.collector ? config.collector : {};

		if (isMatchExtensionsConfig(collectorConfig)) {
			// validate matchExtensions config
			const requiredMessage =
				"is required to use the 'matchExtensions' collector";

			isRequired("collector.root", collectorConfig.root, requiredMessage);

			isRequired(
				"collector.match",
				collectorConfig.match,
				requiredMessage
			);

			isType("collector.match", collectorConfig.match, "array");

			const rootExists = fs.existsSync(collectorConfig.root);
			if (!rootExists) {
				throw new ConfigError(
					"collector.root",
					`directory ${collectorConfig.root} does not exist`
				);
			}

			for (const matcher of collectorConfig.match) {
				if (matcher.charAt(0) !== ".") {
					throw new ConfigError(
						"collector.match",
						`: Matcher should begin with '.', but got '${matcher}'`
					);
				}
			}
		} else if (isEntryPointConfig(collectorConfig)) {
			// validate
			const { root } = collectorConfig;
			if (root) {
				const exists = fs.existsSync(root);
				if (!exists) {
					throw new ConfigError(
						"collector.root",
						`path to root does not exist -> "${root}"`
					);
				}
			}
		} else if (isSequencerConfig(collectorConfig)) {
			// validate sequencer config
			//TODO: Validate 'ignore' option
			isRequired(
				"collector.sequence",
				collectorConfig.sequence,
				"is required to use the 'sequencer' collector"
			);

			isType("collector.sequence", collectorConfig.sequence, "array");

			collectorConfig.sequence.forEach((fileOrDir) => {
				const exists = fs.existsSync(fileOrDir);
				if (!exists) {
					throw new ConfigError(
						"collector.include",
						`path in sequence does not exist -> "${fileOrDir}"`
					);
				}
			});
		} else {
			if (config.collector) {
				throw new ConfigError(
					"runner",
					`Unknown collector, check configuration `
				);
			}
		}
	};
}
