import { it, describe, assert, afterEach } from "../dist";
import { quyz } from "./utils/";
import { isItAction } from "../dist/types";

describe("it", () => {
	afterEach(() => {
		quyz.dev.reset();
	});

	it("should add an ItAction to the queue", () => {
		quyz.it("foo", () => {});
		const queue = quyz.dev.getQueue();
		const action = queue[0];
		assert.strictEqual(queue.length, 1);
		assert.strictEqual(action["title"], "foo");
		assert(isItAction(action));
	});

	describe("title function", () => {
		it("should generate title from args", () => {
			const titleFn = (arg: string) => `title: ${arg}`;
			quyz.it(titleFn, (arg) => {}, "bar");

			const queue = quyz.dev.getQueue();
			assert.strictEqual(queue[0]["title"], "title: bar");
		});
	});
});
