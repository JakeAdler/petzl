import { LogFn, Configuration } from "./types";
import { createColors } from "./utils";
import { devLogStore } from "./dev";

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

export default class Logger {
	logFn: LogFn;
	colors: Colors;
	volume: number;

	constructor(configuration: Configuration) {
		const { colors, volume, dev } = configuration;

		if (dev) {
			this.logFn = devLogStore.log;
		} else {
			this.logFn = console.log;
		}

		this.volume = volume;
		this.colors = createColors(colors);
	}

	padding = "";
	logQueue = [];

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

	dumpLogs = () => {
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
