import { LogFn, Configuration } from "./types";
import { createColors } from "./utils";
import readline from "readline";

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

	logFileOrDirname = (fileOrDir: "file" | "directory", name: string) => {
		this.logFn(
			this.colors.bold(
				this.colors.underline(`Running ${fileOrDir} ${name}`)
			)
		);
	};
}
