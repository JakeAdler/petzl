import { test, group, report } from "../src";
import assert from "assert";

const timeout = () => new Promise((resolve) => setTimeout(resolve, 500));
const sleep = async () => {
	await timeout();
};

(async () => {

	 await test("Non grouped test", () => {
		console.log("logged from inside test");
	 });


	 await test("Ton of assertions", async () => {
	 	await sleep();
		console.log("HAH")
		assert.strictEqual(1, 2)
	 });

	 await test("Non grouped test", () => {
	 	console.log("logged from inside 500 test");
	 });

	 await group("Grouped tests", async () => {
	 	test("grouped test 1", () => {});
	 	test("grouped test 2", () => {
	 		console.log("inside second grouped test");
	 	});
	 	test("grouped test 3", () => {});
	 });

	 await group("Macro style tests", () => {
	 	let data = [23, 24, 25];
	 	for (let i = 0; i < data.length; i++) {
	 		const macro = (index: number, data: number) => {
	 			assert.strictEqual(23 + i, data);
	 		};
	 		const macroTitle = (index) => `Macro ${index}`;
	 		test(macroTitle, macro, i, data[i]);
	 	}
	 });

	 await group("nested groups", async () => {
	 	await group("nested group 1", async () => {
	 		test("super nested test 1", () => {});
	 		test("super nested test 2", () => {});
	 		test("super nested test 3", () => {});
	 	});
	 	await group("nested group 2", async () => {
	 		await test("super nested test 1", async () => {});
	 		await group("super nested group 1", async () => {
	 			await test("super duper nested test 1", () => {});
	 			await group("super duper nested group", () => {
	 				test("super duper nested test 3", () => {
	 					assert.strictEqual(1, 2);
	 				});
	 			});
	 			await test("super duper nested test 2", () => {});
	 		});
	 		await test("super nested test 2", () => {});
	 		await group("nested group 2", async () => {
	 			test("super duper nested test 4", () => {});
	 			test("super duper nested test 5", () => {
	 				console.log("still catches logs");
	 			});
	 			test("super duper nested test 6", () => {});
	 		});
	 		test("super nested test 3", () => {});
	 	});
	 });
})();
