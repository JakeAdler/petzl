import chalk from "chalk";
import { LogFn, Colors, Title, Configuration } from "./types";

class Logger {
	logFn: LogFn;
	colors: Colors;
	format: boolean;
	symbols: boolean;

	constructor(configuration: Configuration) {
		const { logger, format, colors, symbols } = configuration;

		this.logFn = logger.log;
		this.format = format;
		this.symbols = symbols;

		if (colors) {
			this.colors = {
				bold: (...args) => chalk.bold(...args),
				red: (...args) => chalk.red(...args),
				blue: (...args) => chalk.blue(...args),
				green: (...args) => chalk.green(...args),
				magenta: (...args) => chalk.magenta(...args),
				grey: (...args) => chalk.grey(...args),
			};
		} else {
			this.colors = {
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
		if (this.padding.length && this.format !== false) {
			this.logFn(this.padding, ...args);
		} else {
			this.logFn(...args);
		}
	};

	formatTitle = <T extends any[]>(title: Title<T>, ...args: T): string => {
		if (typeof title === "function") {
			title = title(...args);
		}
		return title.trim();
	};

	private capturedLogs = [];

	hijackConsoleLogs = () => {
		global.console.log = (...args: any[]) => {
			this.capturedLogs.push(...args);
		};
	};

	releaseConsoleLogs = () => {
		global.console.log = this.log;
		if (this.capturedLogs.length) {
			for (const message of this.capturedLogs) {
				if (this.symbols !== false) {
					this.log("* ", message);
				} else {
					this.log(message);
				}
			}
		}
		this.capturedLogs = [];
	};
}

export default Logger;
