import { Configuration, Context } from "./types";
import Logger from "./logger";
import { inspect } from "util";
import { AssertionError } from "assert";
import { table } from "table";

const summarize = (
	logger: Logger,
	context: Context,
	configuration: Configuration
) => {
	const { flushPadding, log, colors } = logger;
	const { errors } = context;

	flushPadding();

	let equalSeperator = "";
	let dashSeperator = "";

	if (configuration.symbols !== false) {
		for (let i = 0; i < process.stdout.columns; i++) {
			equalSeperator += "=";
			dashSeperator += "-";
		}
	} else {
		equalSeperator = "\n";
		dashSeperator = "\n";
	}

	if (errors) {
		log(colors.magenta(equalSeperator), "\n");
		for (let i = 0; i < errors.length; i++) {
			const [error, title] = errors[i];

			log(colors.red(colors.bold(`Failed #${i + 1} - ${title}`)));

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
				log(colors.green(`    expected: ${expected}`));
				log(colors.red(`    recieved: ${actual}`));
			} else {
				log(error);
			}

			if (i !== errors.length - 1) {
				log(colors.grey(dashSeperator));
			} else {
				log("\n");
			}
		}
		log(colors.magenta(equalSeperator));
	}
	const passed = [
		colors.green(colors.bold(`Passed`)),
		colors.green(context.passed),
	];
	const faied = [
		colors.red(colors.bold(`Failed`)),
		colors.red(context.failed),
	];
	const runtime = [
		colors.blue(colors.bold(`Runtime`)),
		colors.blue(`${context.totalRuntime}ms`),
	];
	const endReport = [passed, faied, runtime];
	if (configuration.symbols) {
		log(table(endReport));
	} else {
		log(...passed);
		log(...faied);
		log(...runtime);
	}
};

export default summarize;
