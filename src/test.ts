import { performance } from "perf_hooks";
import { log } from "./log";
import testManger from "./testManager";

type Test<T extends any[]> = (...args: T) => Promise<void> | void;

interface TestFunc {
	<T extends any[]>(title: string, cb: Test<T>, ...args: T): Promise<void>;
	before: () => Promise<void> | void;
	after: () => Promise<void> | void;
}

const test: TestFunc = <T extends any[]>(
	title: string,
	cb: Test<T>,
	...args: T
): Promise<void> => {
	const AsyncFunction = (async () => {}).constructor;
	if (cb instanceof AsyncFunction) {
		return new Promise(async (resolve) => {
			try {
				let startTime: number;
				let endTime: number;

				const oldConsoleLog = console.log;

				let logs: any[] = [];

				const calcRunTime = () => Math.round(endTime - startTime);

				try {
					startTime = performance.now();

					await test.before();

					try {
						global.console.log = (...message: any[]) =>
							logs.push(...message);
						await cb(...args);
					} finally {
						global.console.log = oldConsoleLog;
					}

					endTime = performance.now();
					testManger.pass(title, calcRunTime());
				} catch (err) {
					endTime = performance.now();
					testManger.fail(title, calcRunTime(), err);
				} finally {
					if (logs.length) {
						for (const message of logs) {
							log("* ", message);
						}
					}
				}
			} finally {
				resolve();
			}
		});
	} else {
		let startTime: number;
		let endTime: number;

		const oldConsoleLog = console.log;

		let logs: any[] = [];

		const calcRunTime = () => Math.round(endTime - startTime);

		try {
			startTime = performance.now();

			test.before();

			try {
				global.console.log = (...message: any[]) =>
					logs.push(...message);
				cb(...args);
			} finally {
				global.console.log = oldConsoleLog;
			}

			endTime = performance.now();
			testManger.pass(title, calcRunTime());
		} catch (err) {
			endTime = performance.now();
			testManger.fail(title, calcRunTime(), err);
		} finally {
			if (logs.length) {
				for (const message of logs) {
					log("* ", message);
				}
			}
		}
	}
};

test.before = () => {};
test.after = () => {};

export default test;
