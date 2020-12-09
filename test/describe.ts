import { it, beforeAll, afterAll, describe, assert } from "../dist";
import { quyz } from "../test-utils/quyz";
import {
	DescribeEndAction,
	DescribeStartAction,
	isDescribeEndAction,
	isDescribeStartAction,
	isItAction,
} from "../dist/types";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

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

	it("first group should contain 1 test, and 2 nested groups", () => {
		const firstGroup = getGroup(0, 2);

		const startActions = firstGroup.filter(isDescribeStartAction);
		const endActions = firstGroup.filter(isDescribeEndAction);
		const itActions = firstGroup.filter(isItAction);

		assert.strictEqual(startActions.length, 3);

		assert(startActions[0].title === "first group");
		assert(startActions[1].title === "nested group");
		assert(startActions[2].title === "with hooks");

		assert.strictEqual(endActions.length, 3);

		assert.strictEqual(itActions.length, 3);
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

	describe("Title", () => {
		it("haha", () => {});
	});
});
