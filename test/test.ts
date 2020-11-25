import { it, describe } from "../src";
import assert from "assert";

const timeout = () => new Promise((resolve) => setTimeout(resolve, 500));
const sleep = async () => {
	await timeout();
};

export default async () => {
	it("Non grouped test", () => {
		console.log("logged from inside test");
	});

	await it("Ton of assertions", async () => {
		console.log("GOODNIGHT");
		await sleep();
		console.log("HAH");
		console.log("Will have multiple failures");
		assert.strictEqual(1, 2);
		assert.strictEqual(1, 3);
	});

	await it("Non grouped test", async () => {
		console.log("logged from inside 500 test");
	});

	describe("Grouped tests", () => {
		it("grouped test 1", () => {});
		it("grouped test 2", () => {
			/* explode("awww so sad"); */

			console.log("inside second grouped test");
		});
		it("grouped test 3", () => {});
	});

	describe("Macro style tests", () => {
		let data = [23, 24, 25];
		for (let i = 0; i < data.length; i++) {
			const macro = (index: number, data: number) => {
				assert.strictEqual(23 + i, data);
			};
			const macroTitle = (index) => `Macro ${index}`;
			it(macroTitle, macro, i, data[i]);
		}
	});

	await describe("nested groups", async () => {
		await describe("async nested group 1", async () => {
			it("super nested test 1", () => {});
			it("super nested test 2", () => {});
			it("super nested test 3", () => {});
		});
		describe("nested group 1", () => {
			it("super nested test 1", () => {});
			it("super nested test 2", () => {});
			it("super nested test 3", () => {});
		});
		await describe("nested group 2", async () => {
			it("super nested test 1", () => {});
			describe("super nested group 1", () => {
				it("super duper nested test 1", () => {});
				describe("super duper nested group", () => {
					it("super duper nested test 3", () => {
						assert.strictEqual(1, 2);
					});
				});

				it("super duper nested test 2", () => {});
			});

			it("super nested test 2", () => {});
			await describe("nested group 3", async () => {
				console.log("in a describe block");
				await it("super duper nested test 4", () => {});
				await it("super duper nested test 5", async () => {
					console.log("GOODNIGHT");
					await sleep();
					console.log("HAH");
					console.log("still catches logs");
				});
				await it("super duper nested test 6", () => {});
			});
			await it("super nested test 3", () => {});
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
		describe(
			macroGroupTitle,
			(dataEntry) => {
				dataEntry.data.forEach((dataPoint) => {
					const testTitle = (number) =>
						`Test for data point ${number}`;

					it(
						testTitle,
						(data) => {
							console.log(data);
						},
						dataPoint
					);
				});
			},
			dataEntry
		);
	});
};
