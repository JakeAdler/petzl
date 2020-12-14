import { inspect } from "util";
import Logger from "./logger";
import { Configuration, Hooks } from "./types";

export default class Hijacker {
	logger: Logger;
	clog: Console["log"];
	volume: number;
	symbols: boolean;
	dev: boolean;

	constructor(logger: Logger, config: Configuration) {
		this.logger = logger;
		this.clog = Object.freeze(console.log);
		this.volume = config.volume;
		this.dev = config.dev === false ? false : true;
	}

	public capturedLogs = [];

	public hijackConsoleLogs = () => {
		if (!this.dev) {
			global.console.log = (...args: any[]) => {
				this.capturedLogs.push(...args);
			};
		}
	};

	private releaseCaputredlogs = () => {
		const { log } = this.logger;
		const capturedLen = this.capturedLogs.length;
		for (let i = 0; i < capturedLen; i++) {
			const message = this.capturedLogs[i];
			const formatted =
				typeof message === "string" ? message : inspect(message);
			if (i === capturedLen - 1) {
				log(`└ ${formatted}`);
			} else {
				log(`│ ${formatted}`);
			}
		}
		this.resetGlobalLog();
	};

	// Release logs captured by hooks
	public releaseHookLog = (hookName: keyof Hooks, testName?: string) => {
		if (this.capturedLogs.length && this.volume >= 2) {
			this.logger.log(
				this.logger.colors.blue(
					`${hookName}${testName ? ` (${testName})` : ""}:`
				)
			);
			this.releaseCaputredlogs();
		}
		this.capturedLogs = [];
	};

	public releaseDoOnceLog = () => {
		if (this.capturedLogs.length && this.volume >= 2) {
			this.logger.log(this.logger.colors.magenta(`doOnce:`));
			this.releaseCaputredlogs();
		}
		this.capturedLogs = [];
	};

	// Release logs captured by test
	public releaseTestLog = (title: string, runtime: number, pass: boolean) => {
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
		if (!this.dev) global.console.log = this.clog;
		this.capturedLogs = [];
	};
}
