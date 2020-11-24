import chalk from "chalk";
import { log } from "./log";

interface Context {
	passed: number;
	failed: number;
	totalRuntime: number;
	errors: any[];
}
let context: Context = {
	passed: 0,
	failed: 0,
	totalRuntime: 0,
	errors: [],
};

const testManger = {
	pass: (title: string, runtime: number) => {
		log(chalk.green("PASSED: "), title, chalk.green(`(${runtime}ms)`));

		context.passed += 1;
		context.totalRuntime += runtime;
	},
	fail: (title: string, runtime: number, error: Error) => {
		log(chalk.red("FAILED: "), title, chalk.red(`(${runtime}ms)`));

		context.failed += 1;
		context.totalRuntime += runtime;
		context.errors.push([error, title]);
	},
	get: (): Context => {
		return context;
	},
};

export default testManger;
