import { AssertionError } from "assert";
import chalk from "chalk";
import { inspect } from "util";
import { performance } from "perf_hooks";

type SyncCB<T extends any[]> = (...args: T) => void;
type AsyncCB<T extends any[]> = (...args: T) => Promise<void>;
type AnyCB<T extends any[]> = (...args: T) => Promise<void> | void;

type Title<T extends any[]> = string | ((...args: Partial<T>) => string);

interface Context {
	passed: number;
	failed: number;
	totalRuntime: number;
	errors: any[];
}
interface Context {
	passed: number;
	failed: number;
	totalRuntime: number;
	errors: any[];
}

const getTitle = <T extends any[]>(title: Title<T>, ...args: T): string => {
	let rawTitle: string;
	if (typeof title === "string") {
		rawTitle = title;
	} else if (typeof title === "function") {
		rawTitle = title(...args);
	}

	const formattedTitle = rawTitle.trim();

	return formattedTitle;
};

class Logger {
	rawLog: (...args: any[]) => void;

	constructor(logger?: (...args: any[]) => void) {
		if (logger) {
			this.rawLog = logger;
		} else {
			this.rawLog = console.log;
		}
	}

	private padding = "";

	addPadding = () => {
		this.padding += "  ";
	};

	subtractPadding = () => {
		if (this.padding.length === 2) {
			this.padding = "";
		} else {
			this.padding = this.padding.slice(this.padding.length - 2);
		}
	};

	flushPadding = () => {
		this.padding = "";
	};

	log = (...args: any[]) => {
		if (this.padding.length) {
			this.rawLog(this.padding, ...args);
		} else {
			this.rawLog(...args);
		}
	};
}

let capturedLogs = [];

const hijackLogs = () => {
	global.console.log = (...args: any[]) => {
		capturedLogs.push(...args);
	};
};

const printCapturedLogs = (logger: (...args: any[]) => void) => {
	global.console.log = logger;
	if (capturedLogs.length) {
		for (const message of capturedLogs) {
			console.log("* ", message);
		}
	}
	capturedLogs = [];
};

class Clock {
	startTime = 0;
	endTime = 0;
	start = () => {
		this.startTime = performance.now();
	};
	stop = () => {
		this.endTime = performance.now();
	};
	calc = (): number => {
		return Math.round(Math.abs(this.endTime - this.startTime));
	};
}

class Petzl {
	private logger: Logger;

	constructor(logger?: (...args: any[]) => void) {
		this.logger = logger ? new Logger(logger) : new Logger();
		process.on("beforeExit", () => {
			report();
		});
	}

	private context: Context = {
		passed: 0,
		failed: 0,
		totalRuntime: 0,
		errors: [],
	};

	private pass = (title: string, clock: Clock) => {
		clock.stop();
		const runtime = clock.calc();

		this.logger.log(
			chalk.green("PASSED: "),
			title,
			chalk.green(`(${runtime}ms)`)
		);
		this.context.passed += 1;
		if (runtime > 0) {
			this.context.totalRuntime += runtime;
		}
	};

	private fail = (title: string, clock: Clock, error: Error) => {
		clock.stop();
		const runtime = clock.calc();

		this.logger.log(
			chalk.red("FAILED: "),
			title,
			chalk.red(`(${runtime}ms)`)
		);

		this.context.failed += 1;
		this.context.errors.push([error, title]);
		if (runtime > 0) {
			this.context.totalRuntime += runtime;
		}
	};

	public test = <T extends any[]>(
		title: Title<T>,
		cb: AnyCB<T>,
		...args: T
	): Promise<void> | void => {
		const clock = new Clock();
		const formattedTitle = getTitle(title, ...args);
		let isPromise = false;

		try {
			clock.start();
			hijackLogs();
			const possiblePromise = cb(...args);

			if (possiblePromise instanceof Promise) {
				// Resolve promise
				isPromise = true;
				return new Promise(async (resolve) => {
					try {
						await possiblePromise;
						this.pass(formattedTitle, clock);
					} catch (err) {
						this.fail(formattedTitle, clock, err);
					} finally {
						printCapturedLogs(this.logger.log);
						resolve();
					}
				});
			} else {
				// Resolve sync
				this.pass(formattedTitle, clock);
			}
		} catch (err) {
			console.log("SYNC ERROR");
			this.fail(formattedTitle, clock, err);
		} finally {
			if (!isPromise) {
				printCapturedLogs(this.logger.log);
			}
		}
	};

	public group = (title: string, cb: () => Promise<void> | void) => {
		const formattedTitle = title.trim() + ":";
		this.logger.log(chalk.underline.bold(formattedTitle));
		this.logger.addPadding();

		const runGroup = async () => {
			try {
				await cb();
			} finally {
				this.logger.subtractPadding();
			}
		};

		return Promise.resolve(runGroup());
	};

	public report = () => {
		const { flushPadding, log } = this.logger;

		flushPadding();

		const { errors, ...context } = this.context;
		if (errors) {
			for (let i = 0; i < errors.length; i++) {
				const [error, title] = errors[i];
				log(chalk.magenta("====================================="));

				log("\n");

				log(chalk.red.bold.underline(`Failed #${i + 1} - ${title}`));

				const expected =
					typeof error.expected === "object"
						? inspect(error.expected, false, 1)
						: error.expected;

				const actual =
					typeof error.actual === "object"
						? inspect(error.actual, false, 1)
						: error.actual;

				if (error instanceof AssertionError) {
					log(chalk.green(`    expected: ${expected}`));
					log(chalk.red(`    recieved: ${actual}`));
				} else {
					log(error);
				}

				log("\n");
			}
			log(chalk.magenta("====================================="));
		}
		log(chalk.green.bold(`Passed: ${context.passed}`));
		log(chalk.red.bold(`Failed: ${context.failed}`));
		log(chalk.blue.bold(`Runtime: ${context.totalRuntime}ms`));
	};
}

const { test: t, group, report } = new Petzl();

export { t as test, group, report };
export default Petzl;
