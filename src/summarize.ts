import { Action, Configuration, Context, isItAction } from "./types";
import Logger from "./logger";
import { inspect } from "util";
import { AssertionError } from "assert";
import { getBorderCharacters, table } from "table";

export default class Summarizer {
	logger: Logger;
	config: Configuration;

	constructor(logger: Logger, configuration: Configuration) {
		this.logger = logger;
		this.config = configuration;
	}

	createTable = (context: Context) => {
		const { colors } = this.logger;
		const passed = [
			colors.green(colors.bold(`Passed`)),
			colors.green(context.passed.toString()),
		];
		const faied = [
			colors.red(colors.bold(`Failed`)),
			colors.red(context.failed.toString()),
		];
		const runtime = [
			colors.blue(colors.bold(`Runtime`)),
			colors.blue(`${context.testRuntime}ms`),
		];
		const processRuntime = [
			colors.blue(colors.bold(`Process Runtime`)),
			colors.blue(`${process.uptime().toFixed(1)}s`),
		];
		const endReport: string[][] = [passed, faied, runtime, processRuntime];
		return table(endReport, { border: getBorderCharacters("norc") });
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
			this.logger.logFn(this.createTable(context));
		}
	};

	clearSummary = () => {
		if (!this.config.dev) {
			process.stdout.moveCursor(0, -11);
			process.stdout.clearScreenDown();
		}
	};

	endReport = (context: Context) => {
		const { flushPadding, logFn: log, colors } = this.logger;
		const { errors } = context;

		flushPadding();

		if (errors.length) {
			log("\n");
			for (let i = 0; i < errors.length; i++) {
				const [error, title] = errors[i];

				log(colors.red(colors.bold(`Failed:  ${title}`)));

				this.logger.addPadding();
				const pathWithLineNumber = error.stack
					.split("at ")[1]
					.replace(process.cwd() + "/", "");
				log(`@ ${pathWithLineNumber.trim()}`);
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
					log(colors.green(`expected: ${expected}`));
					log(colors.red(`recieved: ${actual}`));
				} else {
					log(error);
				}
				this.logger.subtractPadding();

				log("\n");
			}
		} else {
			log("\n");
		}
		log(this.createTable(context));
	};
}
