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

export default class Logger {
	logFn: LogFn;
	colors: Colors;
	dev: boolean;
	format: boolean;
	symbols: boolean;
	volume: number;

	constructor(configuration: Configuration) {
		const { colors, volume, dev } = configuration;

		if (dev) {
			this.dev = true;
			this.logFn = dev.logger.log;
			this.format = dev.format;
			this.symbols = dev.symbols;
		} else {
			this.dev = false;
			this.logFn = console.log;
			this.format = true;
			this.symbols = true;
		}

		this.volume = volume;
		this.colors = createColors(colors);
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
		if (this.volume >= 2) {
			if (
				this.volume >= 3 &&
				this.padding.length &&
				this.format !== false
			) {
				const [paddedArg, ...rest] = args;
				this.logFn(`${this.padding}${paddedArg}`, ...rest);
			} else {
				this.logFn(...args);
			}
		}
	};

	pass = (title: string, runtime: number) => {
		if (this.volume >= 3) {
			this.log(
				this.colors.green("PASSED: "),
				title,
				this.colors.green(`(${runtime}ms)`)
			);
		}
	};

	fail = (title: string, runtime: number) => {
		if (this.volume >= 3) {
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
		this.addPadding();
	};

	logTestFileName = (fileName: string) => {
		if (this.volume >= 3) {
			const shortPath = fileName.replace(process.cwd(), "");
			this.logFn(this.colors.bold(this.colors.underline(shortPath)));
		}
	};
}
