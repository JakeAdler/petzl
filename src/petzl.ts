import chalk from "chalk";
import { performance } from "perf_hooks";
import Logger from "./logger";
import summarize from "./summarize";
import { Configuration, Title, AnyCB, NestedTestError } from "./types";

const defaultConfiguration: Configuration = {
	logger: console,
	colors: true,
	format: true,
	symbols: true,
	autoRun: true,
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
		this.stop();
		return Math.round(Math.abs(this.endTime - this.startTime));
	};
}

class Petzl {
	private logger: Logger;
	private config: Configuration;

	constructor(configuration?: Configuration) {
		configuration = Object.assign({}, defaultConfiguration, configuration);

		this.config = configuration;

		this.logger = new Logger(this.config);

		if (configuration.autoRun === true) {
			setImmediate(() => {
				require(process.argv[1])
					.default()
					.then(() => {
						summarize(this.logger, this.context, configuration);
					});
			});
		}
	}

	public configure = (options: Partial<Configuration>) => {
		this.config = Object.assign(this.config, options);
		this.logger = new Logger(this.config);
	};

	private context = {
		passed: 0,
		failed: 0,
		totalRuntime: 0,
		errors: [],
	};

	private pass = (title: string, clock: Clock) => {
		const runtime = clock.calc();

		this.isTestRunning = false;

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
		const runtime = clock.calc();

		this.isTestRunning = false;

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

	private isTestRunning = false;

	public it = <T extends any[]>(
		title: Title<T>,
		cb: AnyCB<T>,
		...args: T
	): ReturnType<typeof cb> => {
		if (this.isTestRunning) {
			throw new NestedTestError(
				`\n Cannot nest ${this.logger.colors.bold("it")} blocks \n`
			);
		}

		this.isTestRunning = true;

		const clock = new Clock();

		const formattedTitle = this.logger.formatTitle(title, ...args);

		const pass = () => {
			this.pass(formattedTitle, clock);
		};

		const fail = (err: any) => {
			this.fail(formattedTitle, clock, err);
		};

		try {
			this.logger.hijackConsoleLogs();

			clock.start();

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
	): ReturnType<typeof cb> => {
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
