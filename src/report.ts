import { AssertionError } from "assert";
import chalk from "chalk";
import { inspect } from "util";
import testManager from "./testManager";

const report = () => {
	const { errors, ...context } = testManager.get();
	if (errors) {
		for (let i = 0; i < errors.length; i++) {
			const [error, title] = errors[i];
			console.log(chalk.magenta("====================================="));

			console.log("\n");

			console.log(
				chalk.red.bold.underline(`Failed #${i + 1} - ${title}`)
			);

			const expected =
				typeof error.expected === "object"
					? inspect(error.expected, false, 1)
					: error.expected;

			const actual =
				typeof error.actual === "object"
					? inspect(error.actual, false, 1)
					: error.actual;

			if (error instanceof AssertionError) {
				console.log(chalk.green(`    expected: ${expected}`));
				console.log(chalk.red(`    recieved: ${actual}`));
			} else {
				console.log(error);
			}

			console.log("\n");
		}
		console.log(chalk.magenta("====================================="));
	}
	console.log(chalk.green.bold(`Passed: ${context.passed}`));
	console.log(chalk.red.bold(`Failed: ${context.failed}`));
	console.log(chalk.blue.bold(`Runtime: ${context.totalRuntime}ms`));
};

export default report;
