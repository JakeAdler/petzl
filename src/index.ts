import { AssertionError } from "assert";
import chalk from "chalk";
import { inspect } from "util";
import { performance } from "perf_hooks";

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
			this.padding = this.padding.slice(0, this.padding.length - 2);
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

	formatTitle = <T extends any[]>(title: Title<T>, ...args: T): string => {
		let rawTitle: string;
		if (typeof title === "string") {
			rawTitle = title;
		} else if (typeof title === "function") {
			rawTitle = title(...args);
		}

		const formattedTitle = rawTitle.trim();

		return formattedTitle;
	};

	private capturedLogs = [];

	hijackConsoleLogs = () => {
		global.console.log = (...args: any[]) => {
			this.capturedLogs.push(...args);
		};
	};

	releaseConsoleLogs = () => {
		global.console.log = this.log;
		if (this.capturedLogs.length) {
			for (const message of this.capturedLogs) {
				console.log("* ", message);
			}
		}
		this.capturedLogs = [];
	};
}

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

const entryPoint = "../test/test";

class Petzl {
	private logger: Logger;

	constructor(logger?: (...args: any[]) => void) {
		this.logger = logger ? new Logger(logger) : new Logger();
		process.on("beforeExit", async () => {
			const main = require(entryPoint).default;
			await main();
			process.exit();
		});
		process.on("exit", () => {
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
	): ReturnType<typeof cb> => {
		const clock = new Clock();

		const formattedTitle = this.logger.formatTitle(title, ...args);

		const pass = () => {
			this.pass(formattedTitle, clock);
		};

		const fail = (err) => {
			this.fail(formattedTitle, clock, err);
		};

		const cleanup = () => {
			this.logger.releaseConsoleLogs();
		};

		let isPromise = false;

		try {
			clock.start();
			this.logger.hijackConsoleLogs()

			const possiblePromise = cb(...args);

			if (possiblePromise instanceof Promise) {
				// Resolve promise
				isPromise = true;
				return new Promise<void>(async (resolve) => {
					try {
						await possiblePromise;
						pass();
					} catch (err) {
						fail(err);
					} finally {
						cleanup();
						resolve();
					}
				});
			} else {
				// Resolve sync
				pass();
			}
		} catch (err) {
			fail(err);
		} finally {
			if (!isPromise) {
				cleanup();
			}
		}
	};

	public group = <T extends any[]>(
		title: Title<T>,
		cb: AnyCB<T>,
		...args: T
	) => {
		const formattedTitle = this.logger.formatTitle(title, ...args);

		this.logger.log(chalk.underline.bold(formattedTitle));
		this.logger.addPadding();

		let isPromise = false;

		try {
			const promise = cb(...args);

			if (promise instanceof Promise) {
				isPromise = true;
				return new Promise<void>(async (resolve) => {
					try {
						await promise;
					} finally {
						this.logger.subtractPadding();
						resolve();
					}
				});
			}
		} finally {
			if (!isPromise) {
				this.logger.subtractPadding();
			}
		}
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
					log("   ", error.message.split(':')[0]);
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
