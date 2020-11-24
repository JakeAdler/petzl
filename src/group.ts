import chalk from "chalk";
import { log, addPadding, subtractPadding } from "./log";

const group = (title: string, cb: () => Promise<void> | void) => {
	const formattedTitle = title.trim() + ":";
	log(chalk.underline.bold(formattedTitle));
	addPadding();
	return new Promise<void>(async (resolve) => {
		await cb();
		resolve();
	}).then(() => {
		subtractPadding();
	});
};

export default group;
