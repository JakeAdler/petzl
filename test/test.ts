import {
	it,
	describe,
	beforeEach,
	afterEach,
	doOnce,
	configure,
} from "../dist";
import assert from "assert";

const timeout = () => new Promise((resolve) => setTimeout(resolve, 1000));
const sleep = async () => {
	await timeout();
};

const data = {
	foo: 100,
	bar: {
		baz: "lol",
	},
	bing: {
		bop: "Wow",
	},
	shit: {
		cmon: "now",
	},
};
it("Non grouped test", async () => {
	console.log("haha");
	console.log(data);
});

it("Ton of assertions", async () => {
	console.log("GOODNIGHT");
	await sleep();
	console.log("HAH");
	/* store.set("someKey", "someVal"); */
	console.log("Will have multiple failures");
	assert.strictEqual(1, 2);
	assert.strictEqual(1, 3);
});

it("Non grouped test", async () => {
	console.log("logged from inside 500 test");
});

describe("Grouped tests", () => {
	beforeEach(async () => {
		await sleep();
		console.log("HELLO");
	});
	afterEach(() => {
		console.log("GOODBYE");
	});

	it("grouped test 1", () => {});
	it("grouped test 2", () => {
		console.log("inside second grouped test");
	});
	describe("YO", () => {
		it("NESTED", () => {});
		doOnce(async () => {
			await sleep();
			console.log("WOOOOWW");
		});
		it("NESTED", () => {});
		it("NESTED", () => {});
		it("NESTED", () => {});
	});
	beforeEach(() => {
		console.log("DIFFRENT HOOK NOW");
	});
	it("grouped test 3", () => {});
	it("grouped test 4", () => {});
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

it("last tests", () => {
	/* console.log(store.get("someKey")); */
});
it("last tests", () => {});
it("last tests", () => {});
/* await describe("nested groups", async () => { */
/* 	await describe("async nested group 1", async () => { */
/* 		it("super nested test 1", () => {}); */
/* 		it("super nested test 2", () => {}); */
/* 		it("super nested test 3", () => {}); */
/* 	}); */
/* 	describe("nested group 1", () => { */
/* 		it("super nested test 1", () => {}); */
/* 		it("super nested test 2", () => {}); */
/* 		it("super nested test 3", () => {}); */
/* 	}); */
/* 	await describe("nested group 2", async () => { */
/* 		it("super nested test 1", () => {}); */
/* 		describe("super nested group 1", () => { */
/* 			it("super duper nested test 1", () => {}); */
/* 			describe("super duper nested group", () => { */
/* 				it("super duper nested test 3", () => { */
/* 					assert.strictEqual(1, 2); */
/* 				}); */
/* 			}); */

/* 			it("super duper nested test 2", () => {}); */
/* 		}); */

/* 		it("super nested test 2", () => {}); */
/* 		await describe("nested group 3", async () => { */
/* 			console.log("in a describe block"); */
/* 			await it("super duper nested test 4", () => {}); */
/* 			await it("super duper nested test 5", async () => { */
/* 				console.log("GOODNIGHT"); */
/* 				await sleep(); */
/* 				console.log("HAH"); */
/* 				console.log("still catches logs"); */
/* 			}); */
/* 			await it("super duper nested test 6", () => {}); */
/* 		}); */
/* 		await it("super nested test 3", () => {}); */
/* 	}); */
/* }); */

/* const dataList = [ */
/* 	{ */
/* 		title: "group 1", */
/* 		data: [1, 2, 3], */
/* 	}, */
/* 	{ */
/* 		title: "group 2", */
/* 		data: [3, 4, 5], */
/* 	}, */
/* 	{ */
/* 		title: "group 3", */
/* 		data: [6, 7, 8], */
/* 	}, */
/* ]; */

/* dataList.forEach((dataEntry) => { */
/* 	describe( */
/* 		(entry) => `Macro ${entry.title}`, */
/* 		(dataEntry) => { */
/* 			dataEntry.data.forEach((dataPoint) => { */
/* 				it( */
/* 					(data) => `test for data point ${data}`, */
/* 					(data) => { */
/* 						console.log(data); */
/* 					}, */
/* 					dataPoint */
/* 				); */
/* 			}); */
/* 		}, */
/* 		dataEntry */
/* 	); */
/* }); */
/* }; */
