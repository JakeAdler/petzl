import { quyz } from "../../quyz";
const { it, describe, beforeAll } = quyz;

const getAsyncData = (): Promise<string> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("async group title");
		}, 1);
	});
};

describe("first group", async () => {
	it("outer test", () => {});
	describe("nested group", () => {
		it("inner test", () => {});
	});
	describe("with hooks", () => {
		beforeAll(() => {});
		it("test with hook", () => {});
	});

	const asyncData = await getAsyncData();

	describe(
		() => asyncData,
		() => {
			it("inside async generated group", () => {});
		}
	);
});
