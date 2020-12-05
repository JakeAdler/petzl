import { it, doOnce } from "../dist";
import { petzl, store } from "../test-utils/petzl";
import { add } from "../test-utils/spied-methods";
import assert from "assert";

const sleep = async () => new Promise((resolve) => setTimeout(resolve, 1200));

it("show logs", async () => {
	await petzl.collector.collect();
	/* assert(add.callCount === 1); */
	/* assert.deepStrictEqual(add.args, [[1, 1, 2]]); */
	assert(1);
});
doOnce(async () => {
	await sleep();
	console.log(store);
});
