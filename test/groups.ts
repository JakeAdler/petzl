import { describe, it } from "../src";

export default () => {
	describe("From another file", () => {
		describe("inside 1", () => {
			it("hi", () => {});
			it("hi", () => {});
			it("hi", () => {});
		});
		describe("inside 2", () => {
			it("bye", () => {});
			it("bye", () => {});
			it("bye", () => {});
		});
	});
};
