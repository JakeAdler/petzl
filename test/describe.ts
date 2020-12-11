import { it, beforeAll, afterAll, describe, assert } from "../dist";
import { quyz } from "../test-utils/quyz";
import {
	DescribeEndAction,
	DescribeStartAction,
	isDescribeEndAction,
	isDescribeStartAction,
	isItAction,
} from "../dist/types";
import { inspect } from "util";

describe("describe suite", () => {
	beforeAll(async () => {
		await quyz.dev.collect("test-utils/suites/describe/describe.ts");
	});

	afterAll(() => {
		quyz.dev.reset();
	});

	const getStartActions = (): DescribeStartAction[] => {
		return quyz.dev.getQueue().filter(isDescribeStartAction);
	};

	const getEndActions = (): DescribeEndAction[] => {
		return quyz.dev.getQueue().filter(isDescribeEndAction);
	};

	const getGroup = (startIndex: number, endIndex: number) => {
		const startActions = getStartActions();
		const endActions = getEndActions();
		const queue = quyz.dev.getQueue();
		return queue.slice(
			queue.indexOf(startActions[startIndex]),
			queue.indexOf(endActions[endIndex]) + 1
		);
	};

	it("should contain 1 test, and 3 nested groups", () => {
		const queue = quyz.dev.getQueue();
		const startActions = getStartActions();
		const endActions = getEndActions();
		const itActions = queue.filter(isItAction);

		console.log(inspect(quyz.dev.getQueue()));
		assert.strictEqual(startActions.length, 4);

		assert(startActions[0].title === "first group");
		assert(startActions[1].title === "nested group");
		assert(startActions[2].title === "with hooks");

		assert.strictEqual(endActions.length, 4);

		assert.strictEqual(itActions.length, 4);
	});

	it("nested group should contain 1 test", () => {
		const nestedGroup = getGroup(1, 0);
		assert.strictEqual(nestedGroup.length, 3);
		assert.strictEqual(nestedGroup[0].type, "describe-start");
		assert.strictEqual(
			nestedGroup[nestedGroup.length - 1].type,
			"describe-end"
		);
	});

	it("group with hooks should contain hooks arr", () => {
		const withHooks = getGroup(2, 1);
		assert.strictEqual(withHooks.length, 3);
		const startAction = withHooks[0];
		assert(isDescribeStartAction(startAction));
		if (isDescribeStartAction(startAction)) {
			assert.strictEqual(startAction.hooks.length, 1);
			assert(typeof startAction.hooks[0] === "function");
		}
	});

	it("async tests should be generated", () => {
		const asyncGroup = getGroup(3, 2);

		assert.strictEqual(asyncGroup[0].type, "describe-start");
		assert.strictEqual(asyncGroup[1].type, "it");
		assert.strictEqual(asyncGroup[2].type, "describe-end");

		assert.strictEqual(asyncGroup[0]["title"], "async group title");
		assert.strictEqual(
			asyncGroup[1]["title"],
			"inside async generated group"
		);
	});


});
