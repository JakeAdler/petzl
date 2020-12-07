import { quyz } from "../quyz";
import { add } from "../spied-methods";
const { it } = quyz;

it("1 + 1 === 2", () => {
	add(1, 1, 2);
});

const data = [
	[1, 1, 2],
	[3, 3, 6],
	[1, 1, 3],
];

for (const datum of data) {
	it(
		(num1, num2, expected) => `${num1} + ${num2} === ${expected}`,
		(num1, num2, expected) => {
			add(num1, num2, expected);
		},
		...datum
	);
}
