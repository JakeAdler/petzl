import { performance } from "perf_hooks";
import { devLogStore } from "./dev";
import Logger from "./logger";
import { InputError, Title } from "./types";

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
		return Number((this.endTime - this.startTime).toFixed(2));
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

export const registerProcessEventListeners = (dev: boolean) => {
	const devEnv = process.env["NODE_ENV"] === "test";

	if (!devEnv) {
		process.on("unhandledRejection", (err) => {
			if (err instanceof Error) {
				let message: string;
				if (err instanceof InputError) {
					message = "   " + err.message;
				} else {
					message = `${err.stack} \n   ${err.message}`;
				}
				const log = dev ? devLogStore.log : console.log;
				const colors = createColors(!dev);
				log(colors.red(`Failed (${err.name}):`));
				log("  ", message);
			}
		});

		process.on("uncaughtException", (err) => {
			let message: string;
			if (err instanceof InputError) {
				message = "   " + err.message;
			} else {
				message = `${cleanStack(err)} \n   ${err.message}`;
			}
			const log = dev ? devLogStore.log : console.log;
			const colors = createColors(!dev);
			log(colors.red(`Failed (${err.name}):`));
			log("  ", message);
		});
	}
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
		const init = "\x1b[";
		return {
			underline: (...args) => `${init}4m${args}${reset}`,
			bold: (...args) => `${init}1m${args}${reset}`,
			red: (...args) => `${init}31m${args}${reset}`,
			blue: (...args) => `${init}34m${args}${reset}`,
			green: (...args) => `${init}32m${args}${reset}`,
			yelllow: (...args) => `${init}33m${args}${reset}`,
			magenta: (...args) => `${init}35m${args}${reset}`,
			grey: (...args) => `${init}90m${args}${reset}`,
		};
		// prettier-ignore-end;
	}
};
