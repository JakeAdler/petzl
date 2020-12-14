import { afterAll, assert, beforeAll, describe, it } from "../dist";
import { exec, spawn as nodeSpawn } from "child_process";
import fs from "fs";

describe("collector", () => {
	beforeAll(() => {
		fs.mkdirSync("tmp_test_root");
	});

	afterAll(() => {
		fs.rmdirSync("tmp_test_root");
	});

	const spawn = (cmd) => {
		nodeSpawn(cmd, {
			cwd: "tmp_test_root",
		});
	};

	it("dir exists", () => {

	});
});
