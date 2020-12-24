import { it, describe, assert, beforeAll, afterAll } from "../dist";
import { Quyz } from "./utils";
import path from "path";
import fs from "fs";

describe("collector", () => {
	const rootPath = "tmp_test_root";
	const files = ["test.js", "test2.test.js", "foo.js"].map((p) =>
		path.join(process.env["PWD"], rootPath, p)
	);

	beforeAll(() => {
		fs.mkdirSync(rootPath);
		for (const file of files) {
			fs.writeFileSync(file, "");
		}
	});

	afterAll(() => {
		fs.rmdirSync("tmp_test_root", { recursive: true });
	});

	it("should collect all tests when passed root option", () => {
		const quyz = new Quyz({
			dev: true,
			collector: { root: rootPath },
		});

		quyz.dev.collector.collect();

		const queue = quyz.dev.runner.queue;

		for (const file of files) {
			assert(queue.filter((action) => action["title"] === file));
		}
	});

	it("should match files when passed match option", () => {
		const quyz = new Quyz({
			dev: true,
			collector: { root: "tmp_test_root", match: ".test.js" },
		});

		quyz.dev.collector.collect();

		const queue = quyz.dev.runner.queue;

		assert(queue.filter((action) => action["title"] === files[1]));
	});

	it("should ignore files when passed ignore option", () => {
		const quyz = new Quyz({
			dev: true,
			collector: { root: "tmp_test_root", ignore: "foo.js" },
		});

		quyz.dev.collector.collect();

		const queue = quyz.dev.runner.queue;

		assert(
			queue.every((action) => {
				action["title"] !== files[2];
			})
		);
	});
});
