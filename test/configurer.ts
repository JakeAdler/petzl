import { it, describe, afterEach, beforeAll, afterAll, assert } from "../dist";
import { Quyz } from "../dist/quyz";
import fs from "fs";
import path from "path";

/* Configuration { */
/*	collector: CollectorConfiguration; */
/*	colors: boolean; */
/*	printFileNames: boolean; */
/*	bubbleHooks: boolean; */
/*	volume: number; */
/*	dev: boolean; */
/*	require?: string[]; */
/* } */

describe("configurer", () => {
	describe("base config", () => {
		it("should create Quyz instance with valid base config", () => {
			const passingConfigs: any[] = [
				{
					colors: true,
					printFileNames: true,
					bubbleHooks: true,
					volume: 3,
					dev: true,
					require: ["ts-node"],
				},
				{
					colors: false,
					printFileNames: false,
					bubbleHooks: false,
					volume: 2,
					dev: false,
					require: [],
				},
			];

			for (const config of passingConfigs) {
				const instance = new Quyz(config);
				assert(instance instanceof Quyz);
			}
		});

		it("should fail with invalid base config options", () => {
			const failingConfigs: any[] = [
				{
					colors: "foo",
				},
				{
					colors: 2,
				},
				{
					colors: {},
				},
				{
					printFileNames: "bar",
				},
				{
					printFileNames: 1,
				},
				{
					printFileNames: {},
				},
				{
					bubbleHooks: "baz",
				},
				{
					dev: "boo",
				},
				{
					volume: "bop",
				},
				{
					require: true,
				},
				{
					require: ["foo"],
				},
			];
			for (const config of failingConfigs) {
				assert.throws(() => {
					new Quyz(config);
				});
			}
		});
	});

	describe("collector config", () => {
		beforeAll(() => {
			const rootPath = "tmp_test_root";
			const testPath = path.join(rootPath, "test.js");
			const secondTestPath = path.join(rootPath, "test2.js");
			fs.mkdirSync(rootPath);
			fs.writeFileSync(testPath, "");
			fs.writeFileSync(secondTestPath, "");
		});

		afterAll(() => {
			fs.rmdirSync("tmp_test_root", { recursive: true });
		});

		it("should fail with invalid collector config", () => {
			const failingCollectorConfigs: any[] = [
				{
					use: "entryPoint",
					root: "foo",
				},
				{
					use: "matchExtensions",
				},
				{
					use: "matchExtensions",
					root: "foo",
				},
				{
					use: "matchExtensions",
					root: "foo",
					match: [".ts"],
				},
				{
					use: "matchExtensions",
					root: "test",
					// fails because needs to be array
					match: ".ts",
				},
				{
					use: "sequencer",
				},
				{
					use: "sequencer",
					sequence: "",
				},
			];

			for (const config of failingCollectorConfigs) {
				assert.throws(() => {
					new Quyz({ collector: config });
				});
			}
		});

		it("should create Quyz instance with valid collector config", () => {
			const collectorConfigs: any[] = [
				{
					use: "entryPoint",
					root: "tmp_test_root",
				},
				{
					use: "entryPoint",
				},
				{
					use: "matchExtensions",
					root: "tmp_test_root",
					match: [".js"],
				},
				{
					use: "sequencer",
					sequence: ["tmp_test_root/test.js"],
				},
				{
					use: "sequencer",
					sequence: ["tmp_test_root/test.js"],
					ignore: ["tmp_test_root/test2.js"],
				},
			];

			for (const config of collectorConfigs) {
				const instance = new Quyz({ collector: config });
				assert(instance instanceof Quyz);
			}
		});
	});
});
