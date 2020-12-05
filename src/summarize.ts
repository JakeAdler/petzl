import { Action, Configuration, Context, isItAction } from "./types";
import Logger from "./logger";
import { inspect } from "util";
import { AssertionError } from "assert";

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
		const runtimeFormateted = (context.testRuntime / 1000).toFixed(1);
		const runtime = [
			colors.blue(colors.bold(`Runtime`)),
			colors.blue(`${runtimeFormateted}s`),
		];

		const endReport: string[][] = [passed, failed, runtime];

		for (const line of endReport) {
			this.logger.logFn(...line);
		}
	};

	updateSummary = (context: Context, queue: Action[]) => {
		if (!this.config.dev) {
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

	clearSummary = (goBackUp?: boolean) => {
		if (!this.config.dev) {
			process.stdout.moveCursor(0, -4);
			process.stdout.clearScreenDown();
			if (goBackUp) {
				//TODO: Figure out why this value **should** be one less (-3)
				// than the moveCursor value (-4), or 2 less to print a new line
				// Best tested on volume 2
				process.stdout.moveCursor(0, -2);
			}
		}
	};

	endReport = (context: Context) => {
		const { flushPadding, logFn: log, colors } = this.logger;
		const { errors } = context;

		flushPadding();

		if (errors.length) {
			for (let i = 0; i < errors.length; i++) {
				const [error, title] = errors[i];

				log(colors.red(colors.bold(`Failed: ${title}`)));

				this.logger.addPadding();
				if (error instanceof Error) {
					const pathWithLineNumber = error.stack
						.split("at ")[1]
						.replace(process.cwd() + "/", "");
					log(`@ ${pathWithLineNumber.trim()}`);

					if (error instanceof AssertionError) {
						const expected =
							typeof error.expected === "object"
								? inspect(error.expected, false, 1)
								: error.expected;

						const actual =
							typeof error.actual === "object"
								? inspect(error.actual, false, 1)
								: error.actual;
						log("   ", error.message.split(":")[0]);
						log(colors.green(`expected: ${expected}`));
						log(colors.red(`recieved: ${actual}`));
					} else {
						log(error, "\n");
					}
				} else {
					log(error, "\n");
				}
				this.logger.subtractPadding();
			}
		} else {
			log("\n");
		}
		this.logContext(context);
	};
}
