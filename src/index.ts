import { AssertionError } from "assert";
import chalk from "chalk";
import { inspect } from "util";
import { performance } from "perf_hooks";
import { table } from "table";

type AnyCB<T extends any[]> = (...macroArgs: T) => Promise<void> | void;

type Title<T extends any[]> = string | ((...args: Partial<T>) => string);

interface Configuration {
	logger?: (...args: any[]) => void;
	autoReport?: boolean;
}

const defaultConfiguration: Configuration = {
	logger: console.log,
	autoReport: true,
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
		if (typeof title === "function") {
			title = title(...args);
		}
		return title.trim();
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
				this.log("* ", message);
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

class Petzl {
	private logger: Logger;

	constructor(configuration?: Configuration) {
		configuration = Object.assign({}, configuration, defaultConfiguration);

		const { logger, autoReport } = configuration;

		this.logger = new Logger(logger);

		process.on("beforeExit", async () => {
			const main = require(process.argv[1]).default;
			await main();
			process.exit();
		});

		if (autoReport !== false) {
			process.on("exit", () => {
				report();
			});
		}
	}

	private context = {
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

		this.logger.releaseConsoleLogs();
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

		this.logger.releaseConsoleLogs();
	};

	public it = <T extends any[]>(
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

		try {
			clock.start();
			this.logger.hijackConsoleLogs();

			const possiblePromise = cb(...args);

			if (possiblePromise instanceof Promise) {
				// Resolve promise cb
				return new Promise<void>(async (resolve) => {
					try {
						await possiblePromise;
						pass();
					} catch (err) {
						fail(err);
					} finally {
						resolve();
					}
				});
			} else {
				// Resolve sync cb
				pass();
			}
		} catch (err) {
			fail(err);
		}
	};

	public describe = <T extends any[]>(
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
		const { errors, ...context } = this.context;

		flushPadding();

		let seperator = "";
		for (let i = 0; i < process.stdout.columns; i++) {
			seperator += "=";
		}

		if (errors) {
			log(chalk.magenta(seperator), "\n");
			for (let i = 0; i < errors.length; i++) {
				const [error, title] = errors[i];

				log(chalk.red.bold.underline(`Failed #${i + 1} - ${title}`));

				const pathWithLineNumber = error.stack.split("at ")[1];
				log(`    @ ${pathWithLineNumber.trim()}`);
				const expected =
					typeof error.expected === "object"
						? inspect(error.expected, false, 1)
						: error.expected;

				const actual =
					typeof error.actual === "object"
						? inspect(error.actual, false, 1)
						: error.actual;

				if (error instanceof AssertionError) {
					log("   ", error.message.split(":")[0]);
					log(chalk.green(`    expected: ${expected}`));
					log(chalk.red(`    recieved: ${actual}`));
				} else {
					log(error);
				}

				if (i !== errors.length - 1) {
				}
			}
			log(chalk.magenta(seperator));
		}
		const passed = [chalk.green.bold(`Passed`), context.passed];
		const faied = [chalk.red.bold(`Failed`), context.failed];
		const runtime = [chalk.blue.bold(`Runtime`), context.totalRuntime];
		const endReport = [passed, faied, runtime];
		log(table(endReport));
	};
}

const { it, describe, report } = new Petzl();

export { it, describe, report };
export default Petzl;
