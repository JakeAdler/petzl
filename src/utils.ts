import { performance } from "perf_hooks";
import Logger from "./logger";
import { ConfigError, Configuration, InputError, Title } from "./types";

export class Clock {
	constructor() {
		this.start();
	}

	private startTime = 0;
	private endTime = 0;

	public start = () => {
		this.startTime = performance.now();
	};

	public calc = (): number => {
		this.endTime = performance.now();
		return Math.round(Math.abs(this.endTime - this.startTime));
	};
}

export const formatTitle = <T extends any[]>(
	title: Title<T>,
	...args: T
): string => {
	if (typeof title === "function") {
		title = title(...args);
	}
	return title.trim();
};

export const registerProcessEventListeners = (logger: Logger) => {
	process.on("uncaughtException", (err) => {
		let message: string;
		if (err instanceof InputError) {
			message = err.message;
		} else {
			message = `${cleanStack(err)} \n ${err.message}`;
		}
		logger.logFn(logger.colors.red(`Failed (${err.name}): \n`), message);
	});
};

export const cleanStack = (err: Error) => {
	return (
		"@ " +
		err.stack
			.split("at ")[1]
			.replace(process.cwd() + "/", "")
			.trim()
	);
};

export const createColors = (real: boolean): Logger["colors"] => {
	if (!real) {
		return {
			underline: (args) => args,
			bold: (args) => args,
			red: (args) => args,
			blue: (args) => args,
			green: (args) => args,
			yelllow: (args) => args,
			magenta: (args) => args,
			grey: (args) => args,
		};
	} else {
		// prettier-ignore-start
		const reset = "\x1b[0m";
		return {
			underline: (...args) => `\x1b[4m${args}${reset}`,
			bold: (...args) => `\x1b[1m${args}${reset}`,
			red: (...args) => `\x1b[31m${args}${reset}`,
			blue: (...args) => `\x1b[34m${args}${reset}`,
			green: (...args) => `\x1b[32m${args}${reset}`,
			yelllow: (...args) => `\x1b[33m${args}${reset}`,
			magenta: (...args) => `\x1b[35m${args}${reset}`,
			grey: (...args) => `\x1b[90m${args}${reset}`,
		};
		// prettier-ignore-end;
	}
};
