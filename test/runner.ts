import { it, describe, afterEach, assert } from "../dist";
import { Quyz } from "../dist/quyz";
import { quyz } from "./utils";

describe("runner", () => {
	afterEach(() => {
		quyz.dev.reset();
	});

	for (const passOrFail of ["passed", "failed"] as const) {
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

				quyz.it("foo", () => {
					assert(passOrFail === "failed" ? false : true);
				});

				await quyz.dev.runner.run();

				const afterContext = quyz.dev.getContext();

				assert.strictEqual(afterContext[passOrFail], 1);
				assert(afterContext.testRuntime !== 0);
			},
			passOrFail
		);
	}

	const hooks = [
		"beforeAll",
		"beforeEach",
		"afterAll",
		"afterEach",
		"doOnce",
	];

	for (const hook of hooks) {
		it(`should add error to context if error is throw inside ${hook}`, async () => {
			const beforeContext = quyz.dev.getContext();
			assert.strictEqual(beforeContext.errors.length, 0);

			quyz.describe("group", () => {
				quyz[hook](() => {
					throw new Error();
				});

				quyz.it("foo", () => {});
			});

			await quyz.dev.runner.run();

			const afterContext = quyz.dev.getContext();

			assert.strictEqual(afterContext.errors.length, 1);
		});
	}
});
