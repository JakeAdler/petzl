import chalk from "chalk";
import { performance } from "perf_hooks";
import { inspect } from "util";
import Logger from "./logger";
import summarize from "./summarize";
import {
	Configuration,
	Title,
	AnyCB,
	NestedTestError,
	Explosion,
} from "./types";

const defaultConfiguration: Configuration = {
	logger: console.log,
	autoReport: true,
	colors: true,
	format: true,
	symbols: true,
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
	private config: Configuration;

	constructor(configuration?: Configuration) {
		configuration = Object.assign({}, configuration, defaultConfiguration);

		const { logger, autoReport, colors, format, symbols } = configuration;

		this.config = configuration;

		this.logger = new Logger({ logger, colors, format, symbols });

		process.on("unhandledRejection", (reason) => {
			if (reason["__explosion"]) {
				this.logger.log(
					this.logger.colors.red(`\nExplosion: ${reason["message"]}\n`)
				);
				this.logger.log(reason["err"], "\n");
			} else {
				this.logger.log(
					this.logger.colors.red("\nFatal: unhandled rejection\n")
				);
				this.logger.log(reason, "\n");
			}
			process.exit(1);
		});

		process.on("uncaughtException", (error) => {
			this.logger.log(
				this.logger.colors.red("\nFatal: uncaught exception\n")
			);
			this.logger.log(error, "\n");
			process.exit(1);
		});

		process.on("beforeExit", async (code) => {
			if (!code) {
				const main = require(process.argv[1]).default;
				await main();
			}
			process.exit();
		});

		if (autoReport !== false) {
			process.on("exit", (code) => {
				if (code === 0) {
					summarize(this.logger, this.context, configuration);
				}
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
			this.logger.colors.green("PASSED: "),
			title,
			this.logger.colors.green(`(${runtime}ms)`)
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
			this.logger.colors.red("FAILED: "),
			title,
			this.logger.colors.red(`(${runtime}ms)`)
		);

		this.context.failed += 1;

		this.context.errors.push([error, title]);

		if (runtime > 0) {
			this.context.totalRuntime += runtime;
		}

		this.logger.releaseConsoleLogs();
	};

	public configure = (options: Partial<Configuration>) => {
		this.config = Object.assign(this.config, options);
		this.logger = new Logger(this.config);
	};

	public explode = (message: string) => {
		throw new Explosion(message);
	};

	private canItBeRun = true;

	public it = <T extends any[]>(
		title: Title<T>,
		cb: AnyCB<T>,
		...args: T
	): ReturnType<typeof cb> => {
		if (!this.canItBeRun) {
			throw new NestedTestError(
				`\n Cannot nest ${this.logger.colors.bold("it")} blocks \n`
			);
		}

		this.canItBeRun = false;

		const clock = new Clock();

		const formattedTitle = this.logger.formatTitle(title, ...args);

		const pass = () => {
			this.pass(formattedTitle, clock);
			this.canItBeRun = true;
		};

		const fail = (err: any) => {
			this.fail(formattedTitle, clock, err);
			this.canItBeRun = true;
		};

		const handleError = (err: any) => {
			if (err instanceof Explosion) {
				throw { __explosion: true, message: err.message, err };
			} else {
				fail(err);
			}
		};

		try {
			this.logger.hijackConsoleLogs();

			clock.start();

			const possiblePromise = cb(...args);

			if (possiblePromise instanceof Promise) {
				// Resolve promise cb
				return new Promise<void>(async (resolve, reject) => {
					try {
						await possiblePromise;
						pass();
					} catch (err) {
						handleError(err);
					} finally {
						resolve();
					}
				});
			} else {
				// Resolve sync cb
				pass();
			}
		} catch (err) {
			handleError(err);
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
}

export default Petzl;
