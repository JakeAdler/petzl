import { Configuration, Context } from "./types";
import Logger from "./logger";
import { inspect } from "util";
import { AssertionError } from "assert";
import { getBorderCharacters, table } from "table";

const summarize = (
	logger: Logger,
	context: Context,
	configuration: Configuration
) => {
	const { flushPadding, logFn: log, colors } = logger;
	const { errors } = context;

	flushPadding();

	if (errors.length) {
		log("\n");
		for (let i = 0; i < errors.length; i++) {
			const [error, title] = errors[i];

			log(colors.red(colors.bold(`Failed #${i + 1} - ${title}`)));

			const pathWithLineNumber = error.stack
				.split("at ")[1]
				.replace(process.cwd() + "/", "");
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
				log(colors.green(`    expected: ${expected}`));
				log(colors.red(`    recieved: ${actual}`));
			} else {
				log(error);
			}

			log("\n");
		}
	} else {
		log("\n");
	}
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
	if (configuration.dev && configuration.dev.symbols === false) {
		log(...passed);
		log(...faied);
		log(...runtime);
		log(...processRuntime);
	} else {
		log(table(endReport, { border: getBorderCharacters("norc") }));
	}
};

export default summarize;
