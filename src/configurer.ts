import {
	ConfigError,
	Configuration,
	isEntryPointConfig,
	isMatchExtensionsConfig,
	isSequencerConfig,
} from "./types";
import fs from "fs";
import path from "path";
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

		type Type = "string" | "boolean" | "number";

		const isType = (optionName: string, val: any, type: Type) => {
			if (val && typeof val !== type) {
				throw new ConfigError(
					optionName,
					`Expected option to be of type ${type} but got '${typeof val}'`
				);
			}
		};

		const isArrayOf = (name: string, val: any[], type: Type) => {
			const message = (index?: number) => {
				return `Expected option ${name} to be type of ${
					index ? "array" : type
				} but got type of ${typeof val}`;
			};
			if (val === undefined) return;
			if (!Array.isArray(val)) {
				throw new ConfigError(name, message());
			} else {
				for (let i = 0; i < val.length; i++) {
					if (typeof val[i] !== type) {
						throw new ConfigError(name, message(i));
					}
				}
			}
		};

		const isRequired = (optionName: string, val: any, message?: string) => {
			if (val === undefined || val === null) {
				message = message || "option is required";
				throw new ConfigError(optionName, message);
			}
		};

		const mustExist = (
			optionName: string,
			path: string,
			message?: string
		) => {
			message = message || "Path must exist";
			const exists = fs.existsSync(path);
			if (!exists) throw new ConfigError(optionName, message);
		};

		isArrayOf("require", config.require, "string");

		isType("colors", config.colors, "boolean");

		isType("volume", config.volume, "number");

		isType("bubbleHooks", config.bubbleHooks, "boolean");

		isType("printFileNames", config.printFileNames, "boolean");

		isType("dev", config.dev, "boolean");

		const { collector } = config;

		if (!collector) return;

		if (isMatchExtensionsConfig(collector)) {
			// validate matchExtensions config
			const requiredMessage =
				"is required to use the 'matchExtensions' collector";

			isRequired("collector.root", collector.root, requiredMessage);

			isArrayOf("collector.match", collector.match, "string");

			isRequired("collector.match", collector.match, requiredMessage);

			isArrayOf("collector.match", collector.match, "string");

			mustExist(
				"collector.root",
				collector.root,
				`Root path ${collector.root} does not exist`
			);

			for (let i = 0; i < collector.match.length; i++) {
				const matcher = collector.match[i];

				isType(`collector.match[${i}]`, matcher, "string");

				if (matcher.charAt(0) !== ".") {
					throw new ConfigError(
						"collector.match",
						`: Matcher should begin with '.', but got '${matcher}'`
					);
				}
			}
		} else if (isEntryPointConfig(collector)) {
			isType("collector.root", collector.root, "string");

			if (collector.root) {
				mustExist(
					"collector.root",
					collector.root,
					`path to root does not exist -> "${collector.root}"`
				);
			}
		} else if (isSequencerConfig(collector)) {
			//TODO: Validate 'ignore' option
			isRequired(
				"collector.sequence",
				collector.sequence,
				"is required to use the 'sequencer' collector"
			);

			isArrayOf("collector.sequence", collector.sequence, "string");

			for (const fileOrDir of collector.sequence) {
				mustExist(
					"collector.include",
					fileOrDir,
					`Path in sequence does not exist: ${fileOrDir}`
				);
			}
		} else if (collector.use) {
			throw new ConfigError(
				"collector",
				`Unknown collector '${config.collector.use}', check configuration `
			);
		}
	};
}
