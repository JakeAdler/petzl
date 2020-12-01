import Logger from "./logger";
import { Hooks, LogFn } from "./types";

export default class Hijacker {
	symbols: boolean;
	logFn: LogFn;
	log: LogFn;
	colors: Logger["colors"];
	volume: number;
	addPadding: () => void;
	subtractPadding: () => void;

	constructor(logger: Logger) {
		this.log = logger.log;
		this.logFn = logger.logFn;
		this.colors = logger.colors;
		this.volume = logger.volume;
		this.addPadding = logger.addPadding;
		this.subtractPadding = logger.subtractPadding;
		this.symbols = logger.symbols;
	}

	public capturedLogs = [];

	public hijackConsoleLogs = () => {
		global.console.log = (...args: any[]) => {
			this.capturedLogs.push(...args);
		};
	};

	// Release logs captured by hooks
	public releaseHookLog = (hookName: keyof Hooks, testName: string) => {
		global.console.log = this.log;
		if (this.capturedLogs.length && this.volume >= 2) {
			this.log(this.colors.blue(`${hookName} (${testName}):`));
			this.addPadding();
			for (const message of this.capturedLogs) {
				if (this.symbols !== false) {
					this.log("- ", message);
				} else {
					this.log(message);
				}
			}
			this.subtractPadding();
		}
		this.capturedLogs = [];
	};

	// Release logs captured by test
	public releaseTestLog = (title: string, pass: boolean) => {
		global.console.log = this.log;
		if (this.volume >= 2) {
			if (this.capturedLogs.length) {
				if (this.volume === 2) {
					this.log(this.colors[pass ? "green" : "red"](title));
				}
				for (const message of this.capturedLogs) {
					if (this.symbols !== false) {
						this.log("* ", message);
					} else {
						this.log(message);
					}
				}
			}
		}
		this.capturedLogs = [];
	};

	public resetGlobalLog = () => {
		global.console.log = this.logFn;
		this.capturedLogs = [];
	};
}
