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
	yelllow: ColorFn;
	grey: ColorFn;
}
class LogCache {
	padding = "";
	logQueue = [];

	update = (logger: Logger) => {
		this.padding = logger.padding;
		this.logQueue = logger.logQueue;
	};
}

const cache = new LogCache();

export default class Logger {
	logFn: LogFn;
	colors: Colors;
	volume: number;
	padding: string;
	logQueue: any[];

	constructor(configuration: Configuration, useCache?: boolean) {
		const { colors, volume, dev } = configuration;

		if (!useCache || dev !== false) {
			this.padding = "";
			this.logQueue = [];
		} else {
			this.padding = cache.padding;
			this.logQueue = cache.logQueue;
		}

		if (dev !== false) {
			this.logFn = dev.logger.log;
		} else {
			this.logFn = console.log;
		}

		this.volume = volume;
		this.colors = createColors(colors);
	}

	addPadding = () => {
		this.padding += "  ";
		cache.update(this);
	};

	subtractPadding = () => {
		if (this.padding.length === 2) {
			this.padding = "";
		} else {
			this.padding = this.padding.slice(0, this.padding.length - 2);
		}
		cache.update(this);
	};

	flushPadding = () => {
		this.padding = "";
		cache.update(this);
	};

	public dumpLogs = () => {
		for (let i = 0; i < this.logQueue.length; i++) {
			const logs = this.logQueue[i];
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

		cache.update(this);
	};

	pass = (title: string, runtime: number, force?: boolean) => {
		if (this.volume >= 3 || force) {
			this.log(
				this.colors.green("🗸"),
				title,
				this.colors.green(`(${runtime}ms)`)
			);
		}
	};

	fail = (title: string, runtime: number, force?: boolean) => {
		if (this.volume >= 3 || force) {
			this.log(
				this.colors.red("✘"),
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
			this.log(this.colors.bold(this.colors.underline(shortPath)));
		}
	};

	logCurrentlyRunning = (
		type: "file" | "directory" | "files matching",
		name: string
	) => {
		this.logFn(
			this.colors.bold(this.colors.underline(`Running ${type} ${name}`))
		);
	};
}
