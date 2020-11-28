import chalk from "chalk";
import { LogFn, Colors, Configuration } from "./types";

export default class Logger {
	logFn: LogFn;
	colors: Colors;
	format: boolean;
	symbols: boolean;
	volume: number;

	constructor(configuration: Configuration) {
		const { logger, format, colors, symbols, volume } = configuration;

		this.logFn = logger.log;
		this.format = format;
		this.symbols = symbols;
		this.volume = volume;

		if (colors) {
			this.colors = {
				underline: (...args) => chalk.underline(...args),
				bold: (...args) => chalk.bold(...args),
				red: (...args) => chalk.red(...args),
				blue: (...args) => chalk.blue(...args),
				green: (...args) => chalk.green(...args),
				magenta: (...args) => chalk.magenta(...args),
				grey: (...args) => chalk.grey(...args),
			};
		} else {
			this.colors = {
				underline: (args) => args,
				bold: (args) => args,
				red: (args) => args,
				blue: (args) => args,
				green: (args) => args,
				magenta: (args) => args,
				grey: (args) => args,
			};
		}
	}

	private padding = "";

	addPadding = () => {
		this.padding += "  ";
	};

	subtractPadding = () => {
		if (this.padding.length === 2) {
			this.padding = "";
		} else {
			this.padding = this.padding.slice(0, this.padding.length - 2);
		}
	};

	flushPadding = () => {
		this.padding = "";
	};

	log = (...args: any[]) => {
		if (this.volume >= 2) {
			if (this.volume >= 3) {
				if (this.padding.length && this.format !== false) {
					const [paddedArg, ...rest] = args;
					this.logFn(`${this.padding}${paddedArg}`, ...rest);
				} else {
					this.logFn(...args);
				}
			}
		}
	};

	pass = (title: string, runtime: number, capturedLogs: any[]) => {
		if (this.volume >= 3) {
			this.log(
				this.colors.green("PASSED: "),
				title,
				this.colors.green(`(${runtime}ms)`)
			);
		} else {
			if (capturedLogs.length) {
				this.log(
					this.colors.green("PASSED: "),
					title,
					this.colors.green(`(${runtime}ms)`)
				);
			}
		}
	};

	fail = (title: string, runtime: number, capturedLogs: any[]) => {
		if (this.volume >= 3) {
			this.log(
				this.colors.red("FAILED: "),
				title,
				this.colors.red(`(${runtime}ms)`)
			);
		} else {
			if (capturedLogs.length) {
				this.log(
					this.colors.red("FAILED: "),
					title,
					this.colors.red(`(${runtime}ms)`)
				);
			}
		}
	};

	logGroupTitle = (title: string) => {
		if (this.volume >= 3) {
			this.log(this.colors.bold(this.colors.underline(title)));
			this.addPadding();
		}
	};

}
