import { it, describe, configure, beforeEach } from "../dist";
import assert from "assert";

/* let testPetzlLogs = []; */

/* const testPetzlLogger = { */
/* 	log: (...args: any[]) => { */
/* 		testPetzlLogs.push(args); */
/* 	}, */
/* }; */

/* const testPetzl = new Petzl({ */
/* 	logger: testPetzlLogger, */
/* 	autoRun: false, */
/* 	colors: false, */
/* 	format: false, */
/* }); */

/* describe("Logs", () => { */
/* 	testPetzl.it("passing test", () => { */
/* 		assert.strictEqual(1, 1); */
/* 	}); */
/* 	it("passed test should log as expected", () => { */
/* 		assert.strictEqual(testPetzlLogs[0][0], "PASSED: "); */
/* 		assert.strictEqual(testPetzlLogs[0][1], "passing test"); */
/* 		assert.strictEqual(typeof testPetzlLogs[0][2], "string"); */
/* 	}); */
/* 	testPetzl.it("failing test", () => { */
/* 		assert.strictEqual(1, 2); */
/* 	}); */
/* 	it("failing test should log as expected", () => { */
/* 		assert.strictEqual(testPetzlLogs[1][0], "FAILED: "); */
/* 		assert.strictEqual(testPetzlLogs[1][1], "failing test"); */
/* 		assert.strictEqual(typeof testPetzlLogs[1][2], "string"); */
/* 	}); */
/* }); */
configure({ bubbleHooks: true });

it("WOW", () => {});

describe("level 1", () => {
	beforeEach(() => {
		console.log(1);
	});
	it("WOW", () => {});
	it("WOW", () => {});
	it("WOW", () => {});
	describe("level 2", () => {
		beforeEach(() => {
			console.log(2);
		});
		it("BOO", () => {});
		it("BOO", () => {});
		describe("level 3", () => {
			it("YEE", () => {});
			it("YEE", () => {});
		});
	});
	it("WOW", () => {});
	it("WOW", () => {});
	it("WOW", () => {});
});
