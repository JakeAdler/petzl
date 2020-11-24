import { test, group, report } from "../src";
import assert from "assert";

(async () => {
	test("Non grouped test", () => {
		console.log("logged from inside test");
	});

	await test("Non grouped test", async () => {
		await new Promise((resolve) => {
			console.log("logged from inside 500 test");
			setTimeout(resolve, 500);
		});
	});

	await group("Grouped tests", () => {
		test("grouped test 1", () => {});
		test("grouped test 2", () => {
			console.log("inside second grouped test");
		});
		test("grouped test 3", () => {});
	});

	await group("Macro style tests", async () => {
		let data = [23, 24, 25];
		for (let i = 0; i < data.length; i++) {
			const macro = (index: number, data: number) => {
				assert.strictEqual(23 + i, data);
			};
			await test(`Macro #${i}`, macro, i, data[i]);
		}
	});

	await group("nested groups", async () => {
		await group("nested group 1", async () => {
			test("super nested test 1", () => {});
			test("super nested test 2", () => {});
			test("super nested test 3", () => {});
		});
		await group("nested group 2", async () => {
			test("super nested test 1", async () => {});
			await group("super nested group 1", async () => {
				test("super duper nested test 1", () => {});
				test("super duper nested test 2", () => {});
				test("super duper nested test 3", () => {});
			});
			test("super nested test 2", () => {});
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

	await test("Ton of assertions", async () => {
		for (let i = 0; i < 100000; i++) {
			assert(eval("1 === 1"))
		}
	});

	report();
})();
