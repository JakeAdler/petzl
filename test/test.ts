import { test, group } from "../src";
import assert from "assert";

const timeout = () => new Promise((resolve) => setTimeout(resolve, 500));
const sleep = async () => {
	await timeout();
};

export default async () => {
	test("Non grouped test", () => {
		console.log("logged from inside test");
	});
	await test("Ton of assertions", async () => {
		console.log("GOODNIGHT");
		await sleep();
		console.log("HAH");
		assert.strictEqual(1, 2);
	});
	test("Non grouped test", () => {
		console.log("logged from inside 500 test");
	});
	group("Grouped tests", () => {
		test("grouped test 1", () => {});
		test("grouped test 2", () => {
			console.log("inside second grouped test");
		});
		test("grouped test 3", () => {});
	});
	group("Macro style tests", () => {
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
		await group("async nested group 1", async () => {
			test("super nested test 1", () => {});
			test("super nested test 2", () => {});
			test("super nested test 3", () => {});
		});
		group("nested group 1", () => {
			test("super nested test 1", () => {});
			test("super nested test 2", () => {});
			test("super nested test 3", () => {});
		});
		await group("nested group 2", async () => {
			test("super nested test 1", () => {});
			group("super nested group 1", () => {
				test("super duper nested test 1", () => {});
				group("super duper nested group", () => {
					test("super duper nested test 3", () => {
						assert.strictEqual(1, 2);
					});
				});
				test("super duper nested test 2", () => {});
			});
			test("super nested test 2", () => {});
			await group("nested group 2", async () => {
				await test("super duper nested test 4", () => {});
				await test("super duper nested test 5", async () => {
					console.log("GOODNIGHT");
					await sleep();
					console.log("HAH");
					console.log("still catches logs");
				});
				await test("super duper nested test 6", () => {});
			});
			await test("super nested test 3", () => {});
		});
	});

	const dataList = [
		{
			title: "group 1",
			data: [1, 2, 3],
		},
		{
			title: "group 2",
			data: [3, 4, 5],
		},
		{
			title: "group 3",
			data: [6, 7, 8],
		},
	];

	dataList.forEach((dataEntry) => {
		const macroGroupTitle = (entry) => `Macro ${entry.title}`;
		group(
			macroGroupTitle,
			(dataEntry) => {
				dataEntry.data.forEach((dataPoint) => {

				const testTitle = (number) => `Test for data point ${number}`;

				test(testTitle, (data) => {
					console.log(data)
				}, dataPoint)

				})
			},
			dataEntry
		);
	});
};
