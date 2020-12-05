import { spy } from "sinon";
import assert from "assert";

export const add = spy((num1: number, num2: number, expectedSum: number) => {
	assert(num1 + num2 === expectedSum);
});

export const addingMacro = spy(
	(num1: number, num2: number, expectedSum: number) => {
		add(num1, num2, expectedSum);
	}
);
