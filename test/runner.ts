import { it, describe, afterEach, assert, doOnce } from "../dist";
import { quyz } from "./utils";
import { performance } from "perf_hooks";

describe("runner", () => {
	afterEach(() => {
		quyz.dev.reset();
	});

	for (const passOrFail of ["passed", "failed"]) {
		const titleFn = (passOrFail: string) =>
			`should update context after running one ${
				passOrFail === "failed" ? "failing" : "passing"
			} test`;

		it(
			titleFn,
			async (passOrFail) => {
				const beforeContext = quyz.dev.getContext();

				assert.strictEqual(beforeContext[passOrFail], 0);
				assert.strictEqual(beforeContext.testRuntime, 0);
				quyz.describe("group", () => {
					if (passOrFail === "passed") {
						quyz.it("foo", () => {});
					} else {
						quyz.it("foo", () => {
							assert(false);
						});
					}
				});

				await quyz.dev.runner.run();

				const afterContext = quyz.dev.getContext();

				assert.strictEqual(afterContext[passOrFail], 1);
				assert(afterContext.testRuntime !== 0);
			},
			passOrFail
		);
	}
});
