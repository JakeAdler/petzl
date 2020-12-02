import { LogFn, Configuration } from "./types";
import { createColors } from "./utils";

export type ColorFn = (...args: any[]) => string;

export interface Colors {
	underline: ColorFn;
	red: ColorFn;
	green: ColorFn;
	blue: ColorFn;
	bold: ColorFn;
	magenta: ColorFn;
	grey: ColorFn;
}
class LogCache {
	padding = "";
	logQueue = [];
}

const cache = new LogCache();

export default class Logger {
	logFn: LogFn;
	colors: Colors;
	volume: number;
	padding: string;

	constructor(configuration: Configuration) {
		const { colors, volume } = configuration;

		this.padding = cache.padding;
		this.logQueue = cache.logQueue;
		this.logFn = console.log;
		this.volume = volume;
		this.colors = createColors(colors);
	}

	addPadding = () => {
		this.padding += "  ";
		cache.padding = this.padding;
	};

	subtractPadding = () => {
		if (this.padding.length === 2) {
			this.padding = "";
		} else {
			this.padding = this.padding.slice(0, this.padding.length - 2);
		}
		cache.padding = this.padding;
	};

	flushPadding = () => {
		this.padding = "";
		cache.padding = this.padding;
	};

	public logQueue = [];

	public dumpLogs = () => {
		for (const logs of this.logQueue) {
			this.logFn(...logs);
		}
	};
	log = (...args: any[]) => {
		if (this.volume === 3) {
			const [paddedArg, ...rest] = args;
			this.logQueue.push([`${this.padding}${paddedArg}`, ...rest]);
		}
		if (this.volume <= 2) {
			this.logQueue.push(args);
		}

		cache.logQueue = this.logQueue;
	};

	pass = (title: string, runtime: number, force?: boolean) => {
		if (this.volume >= 3 || force) {
			this.log(
				this.colors.green("PASSED: "),
				title,
				this.colors.green(`(${runtime}ms)`)
			);
		}
	};

	fail = (title: string, runtime: number, force?: boolean) => {
		if (this.volume >= 3 || force) {
			this.log(
				this.colors.red("FAILED: "),
				title,
				this.colors.red(`(${runtime}ms)`)
			);
		}
	};

	logGroupTitle = (title: string) => {
		if (this.volume >= 3) {
			this.log(this.colors.bold(this.colors.underline(title)));
		}
	};

	logTestFileName = (fileName: string) => {
		if (this.volume >= 3) {
			const shortPath = fileName.replace(process.cwd(), "");
			this.logFn(this.colors.bold(this.colors.underline(shortPath)));
		}
	};
}
