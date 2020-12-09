import { Action, Configuration, Context, isItAction } from "./types";
import Logger from "./logger";
import { inspect } from "util";
import { AssertionError } from "assert";
import { cleanStack } from "./utils";

export default class Summarizer {
	logger: Logger;
	config: Configuration;

	constructor(logger: Logger, configuration: Configuration) {
		this.logger = logger;
		this.config = configuration;
	}

	logContext = (context: Context) => {
		const { colors } = this.logger;
		const passed = [
			colors.green(colors.bold(`Passed `)),
			colors.green(context.passed.toString()),
		];
		const failed = [
			colors.red(colors.bold(`Failed `)),
			colors.red(context.failed.toString()),
		];
		const runtimeFormateted = context.testRuntime.toFixed(2);
		const runtime = [
			colors.blue(colors.bold(`Runtime`)),
			colors.blue(`${runtimeFormateted}ms`),
		];

		const endReport: string[][] = [passed, failed, runtime];

		for (const line of endReport) {
			this.logger.logFn(...line);
		}
	};

	updateSummary = (context: Context, queue: Action[], clear = true) => {
		if (
			!this.config.dev &&
			typeof process.stdout.moveCursor === "function"
		) {
			if (clear) this.clearSummary();

			const numTests = queue.filter((action: Action) => {
				if (isItAction(action)) {
					return action;
				}
			}).length;
			this.logger.logFn(
				this.logger.colors.yelllow("Running"),
				`${context.passed + context.failed}/${numTests}`
			);
			this.logContext(context);
		}
	};

	clearSummary = () => {
		if (
			!this.config.dev &&
			typeof process.stdout.moveCursor === "function"
		) {
			process.stdout.moveCursor(0, -4);
			process.stdout.clearScreenDown();
		}
	};

	updateResolveLogs = (completed: number, total: number, clear = true) => {
		if (
			!this.config.dev &&
			typeof process.stdout.moveCursor === "function"
		) {
			if (clear) this.clearResolveLogs();

			this.logger.logFn(
				this.logger.colors.yelllow("Resolving"),
				`(${completed}/${total})`
			);
		}
	};

	clearResolveLogs = () => {
		if (
			!this.config.dev &&
			typeof process.stdout.moveCursor === "function"
		) {
			process.stdout.moveCursor(0, -1);
			process.stdout.clearScreenDown();
		}
	};

	private parseErrors = (errors: [any, string][]) => {
		const { logFn: log, colors } = this.logger;

		if (errors.length) {
			for (const error of errors) {
				const [err, title] = error;
				log(colors.red(colors.bold(`\nFailed: ${title}`)));

				this.logger.addPadding();
				if (err instanceof Error) {
					const stack = cleanStack(err);
					log(stack);

					if (err instanceof AssertionError) {
						const expected =
							typeof err.expected === "object"
								? inspect(err.expected, false, 1)
								: err.expected;

						const actual =
							typeof err.actual === "object"
								? inspect(err.actual, false, 1)
								: err.actual;

						log("   ", err.message.split(":")[0]);
						log("   ", colors.green(`expected: ${expected}`));
						log("   ", colors.red(`recieved: ${actual}`), "\n");
					} else {
						log(err, "\n");
					}
				} else {
					log(err, "\n");
				}
				this.logger.subtractPadding();
			}
		} else {
			log("\n");
		}
	};

	endReport = (context: Context) => {
		this.logger.dumpLogs();

		this.logger.flushPadding();

		this.parseErrors(context.errors);

		this.logContext(context);
	};
}
