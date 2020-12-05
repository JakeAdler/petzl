import { it, beforeEach, doOnce } from "../dist";
import { petzl, store } from "../test-utils/petzl";
import { add } from "../test-utils/spied-methods";
import assert from "assert";

const sleep = async () => new Promise((resolve) => setTimeout(resolve, 1200));

doOnce(async () => {
	await petzl.collector.collect();
});

it("show logs", async () => {
	console.log(store.getLogs());
});

