import { it, beforeAll, afterAll, describe } from "../dist";
import { quyz } from "../test-utils/quyz";
import assert from "assert";
import {
	isFileEndAction,
	isFileStartAction,
	isItAction,
	ItAction,
} from "../dist/types";
import { add } from "../test-utils/suites/it";

describe("it suite", () => {
	beforeAll(async () => {
		await quyz.dev.collect("test-utils/suites/it/it.ts");
	});

	afterAll(() => {
		quyz.dev.reset();
	});

	const getItActions = (): ItAction<any[]>[] => {
		return quyz.dev.getQueue().filter(isItAction);
	};

	it("context should have 3 passed 0 failed", () => {
		const context = quyz.dev.runner.context;

		assert.strictEqual(context.passed, 3);
		assert.strictEqual(context.failed, 0);
		assert.strictEqual(context.errors.length, 0);
	});

	it("queue should contain 3 tests", () => {
		const queue = quyz.dev.getQueue();
		assert.strictEqual(queue.length, 5);

		for (let i = 0; i < queue.length; i++) {
			const action = queue[i];
			if (isItAction(action)) {
				assert.strictEqual(action.type, "it");
				assert(action.title);
				assert(action.cb);
				assert(action.args);
			} else {
				assert(isFileStartAction(action) || isFileEndAction(action));
			}
		}
	});

	it("should have produced 2 tests with same title", () => {
		const itActions = getItActions();
		assert.strictEqual(itActions[0].title, itActions[1].title);
	});

	it("action titles should match logs", () => {
		const itActions = getItActions();
		const testLogs = quyz.dev.getLogs().filter((arr) => {
			return arr[0] === "🗸";
		});

		assert.strictEqual(testLogs.length, 3);

		assert.strictEqual(testLogs[0][1], itActions[0].title);
		assert.strictEqual(testLogs[1][1], itActions[1].title);

		assert.strictEqual(testLogs[2][1], itActions[2].title);
	});

	it("should have called spy 3 times", () => {
		assert.strictEqual(add.getCalls().length, 3);
	});
});
