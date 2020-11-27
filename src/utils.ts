import { performance } from "perf_hooks";
import { Title } from "./types";

export const formatTitle = <T extends any[]>(
	title: Title<T>,
	...args: T
): string => {
	if (typeof title === "function") {
		title = title(...args);
	}
	return title.trim();
};

export class Clock {
	constructor() {
		this.start();
	}

	private startTime = 0;
	private endTime = 0;

	public start = () => {
		this.startTime = performance.now();
	};

	public calc = (): number => {
		this.endTime = performance.now();
		return Math.round(Math.abs(this.endTime - this.startTime));
	};
}
