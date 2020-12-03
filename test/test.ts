import { it, describe, beforeEach, afterEach, doOnce } from "../dist";
import { petzl, store } from "../test-utils/petzl";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

doOnce(async () => {
	petzl.runner.run();
	await sleep();
});

it("show logs", async () => {
	/* petzl.runner.run(); */
	console.log("HI");
	console.log(store);
	await sleep();
});
