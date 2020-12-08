import { it, beforeEach, afterAll, doOnce, describe } from "../dist";
import { quyz, reset, store } from "../test-utils/quyz";
import assert from "assert";
import { isItAction, ItAction } from "../dist/types";

/* describe("it", () => { */
/* 	doOnce(async () => { */
/* 		await quyz.dev.collect("test-utils/suites/it.ts"); */
/* 	}); */

/* 	const getItActions = (): ItAction<any[]>[] => { */
/* 		return quyz.dev.getQueue().filter(isItAction); */
/* 	}; */

/* 	it("queue should contain 3 tests", () => { */
/* 		const queue = quyz.dev.getQueue(); */
/* 		assert.strictEqual(queue.length, 3); */

/* 		for (let i = 0; i < queue.length; i++) { */
/* 			const action = queue[i]; */
/* 			assert(isItAction(action)); */
/* 			if (isItAction(action)) { */
/* 				assert.strictEqual(action.type, "it"); */
/* 				assert(action.title); */
/* 				assert(action.cb); */
/* 				assert(action.args); */
/* 			} */
/* 		} */
/* 	}); */

/* 	it("first and second test should have same title", () => { */
/* 		const itActions = getItActions(); */

/* 		assert.strictEqual(itActions[0].title, itActions[1].title); */
/* 	}); */

/* 	it("context should have 3 passed 0 failed", () => { */
/* 		const logs = store.getLogs(); */
/* 		const context = quyz.dev.getContext(); */

/* 		assert.strictEqual(context.passed, 3); */
/* 		assert.strictEqual(context.failed, 0); */
/* 		assert.strictEqual(context.errors.length, 0); */

/* 		assert.strictEqual(logs[3][0], "Passed "); */
/* 		assert.strictEqual(logs[3][1], "3"); */
/* 		assert.strictEqual(logs[4][0], "Failed "); */
/* 		assert.strictEqual(logs[4][1], "0"); */
/* 	}); */

/* 	it("action titles should match logs", () => { */
/* 		const itActions = getItActions(); */
/* 		const logs = store.getLogs(); */

/* 		assert.strictEqual(logs.length, 6); */

/* 		assert.strictEqual(logs[0][1], itActions[0].title); */
/* 		assert.strictEqual(logs[1][1], itActions[1].title); */

/* 		assert.strictEqual(logs[2][1], itActions[2].title); */
/* 	}); */

/* 	doOnce(() => { */
/* 		reset(); */
/* 	}); */
/* }); */

it("wow", () => {});
it("wow", () => {});
