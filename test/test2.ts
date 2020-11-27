import Petzl, { it, describe } from "../src";
import assert from "assert";

let testPetzlLogs = [];

const testPetzlLogger = {
	log: (...args: any[]) => {
		testPetzlLogs.push(args);
	},
};

const testPetzl = new Petzl({
	logger: testPetzlLogger,
	autoRun: false,
	colors: false,
	format: false,
});

export default async () => {
	describe("Logs", () => {
		testPetzl.it("passing test", () => {
			assert.strictEqual(1, 1);
		});
		it("passed test should log as expected", () => {
			assert.strictEqual(testPetzlLogs[0][0], "PASSED: ");
			assert.strictEqual(testPetzlLogs[0][1], "passing test");
			assert.strictEqual(typeof testPetzlLogs[0][2], "string");
		})
		testPetzl.it("failing test", () => {
			assert.strictEqual(1, 2);
		});
		it("failing test should log as expected", () => {
			assert.strictEqual(testPetzlLogs[1][0], "FAILED: ");
			assert.strictEqual(testPetzlLogs[1][1], "failing test");
			assert.strictEqual(typeof testPetzlLogs[1][2], "string");
		});
	});
};
