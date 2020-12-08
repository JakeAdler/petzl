import sinon from "sinon";
import assert from "assert";

export const add = sinon.spy((num1: number, num2: number, expected: number) => {
	assert.strictEqual(num1 + num2, expected);
});
