import Logger from "./logger";
import { Configuration, Hooks } from "./types";

export default class Hijacker {
	log: Logger["log"];
	pass: Logger["pass"];
	fail: Logger["fail"];
	logFn: Logger["logFn"];
	colors: Logger["colors"];
	volume: number;
	symbols: boolean;

	constructor(logger: Logger, config: Configuration) {
		this.log = logger.log;
		this.pass = logger.pass;
		this.fail = logger.fail;
		this.logFn = logger.logFn;
		this.colors = logger.colors;
		this.volume = config.volume;
	}

	public capturedLogs = [];

	public hijackConsoleLogs = () => {
		global.console.log = (...args: any[]) => {
			this.capturedLogs.push(...args);
		};
	};

	private releaseCaputredlogs = () => {
		const capturedLen = this.capturedLogs.length;
		for (let i = 0; i < capturedLen; i++) {
			const message = this.capturedLogs[i];
			if (i === capturedLen - 1) {
				this.log("└ ", message);
			} else {
				this.log("│ ", message);
			}
		}
	};
	// Release logs captured by hooks
	public releaseHookLog = (hookName: keyof Hooks, testName: string) => {
		global.console.log = this.log;
		if (this.capturedLogs.length && this.volume >= 2) {
			this.log(this.colors.blue(`${hookName} (${testName}):`));
			this.releaseCaputredlogs();
		}
		this.capturedLogs = [];
	};

	// Release logs captured by test
	public releaseTestLog = (title: string, runtime: number, pass: boolean) => {
		global.console.log = this.log;
		if (this.volume >= 2) {
			const capturedLen = this.capturedLogs.length;

			if (this.volume === 2 && capturedLen) {
				this[pass ? "pass" : "fail"](title, runtime, true);
			}
			this.releaseCaputredlogs();
		}
		this.capturedLogs = [];
	};

	public resetGlobalLog = () => {
		global.console.log = this.logFn;
		this.capturedLogs = [];
	};
}
