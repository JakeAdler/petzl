import { it, afterEach, describe, assert } from "../dist";
import {
	isDescribeAction,
	isDescribeEndAction,
	isDescribeStartAction,
} from "../dist/types";
import { quyz } from "./utils/";

describe("describe", () => {
	afterEach(() => {
		quyz.dev.reset();
	});

	it("should add DescribeStart Describe and DescribeEnd Action", () => {
		quyz.describe("foo", () => {});
		const queue = quyz.dev.getQueue();

		assert.strictEqual(queue.length, 3);
		assert(isDescribeStartAction(queue[0]));
		assert.strictEqual(queue[0]["title"], "foo");
		assert(isDescribeAction(queue[1]));
		assert(isDescribeEndAction(queue[2]));
	});

	const asyncDescribes: [string, () => void, number[]][] = [
		[
			"should add async describe block to queue asynchronously",
			() => {
				quyz.describe("single async group", async () => {
					quyz.it("1", () => {});
					quyz.it("2", () => {});
					quyz.it("3", () => {});
				});
			},
			[3, 5],
		],
		[
			"should add nested async describe blocks to queue asynchronously",
			() => {
				quyz.describe("parent group", async () => {
					quyz.it("1", () => {});
					quyz.describe("nested group", async () => {
						quyz.it("2", () => {});
						quyz.it("3", () => {});
					});
				});
				quyz.describe("second parent group", async () => {
					quyz.it("1", () => {});
					quyz.it("2", () => {});
					quyz.it("3", () => {});
				});
			},
			[6, 12],
		],
	];

	for (const group of asyncDescribes) {
		const [title, fn, lengths] = group;
		it(
			title,
			async ([initial, after]) => {
				fn();
				const beforeQueue = quyz.dev.getQueue();

				assert.strictEqual(beforeQueue.length, initial);

				await quyz.dev.runner.processQueue();

				const afterQueue = quyz.dev.getQueue();

				assert.strictEqual(afterQueue.length, after);
			},
			lengths
		);
	}

	describe("title function", () => {
		it("should generate title from args", () => {
			const titleFn = (arg: string) => `title: ${arg}`;

			quyz.describe(titleFn, (x) => {}, "bar");

			const queue = quyz.dev.getQueue();

			assert.strictEqual(queue[0]["title"], "title: bar");
		});
	});
});
