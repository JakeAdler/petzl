import { quyz } from "../../quyz";
const { it, describe, beforeAll } = quyz;

describe("first group", () => {
	it("outer test", () => {});
	describe("nested group", () => {
		it("inner test", () => {});
	});
	describe("with hooks", () => {
		beforeAll(() => {});
		it("test with hook", () => {});
	});
});
