export type AnyCB = () => Promise<void> | void;

export type TestCB<T extends any[]> = (...macroArgs: T) => Promise<void> | void;

export type LogFn = (...args: any[]) => void;

export type Title<T extends any[]> = string | ((...args: Partial<T>) => string);

export interface Configuration {
	logger?: Pick<Console, "log">;
	colors?: boolean;
	format?: boolean;
	symbols?: boolean;
	autoRun?: boolean;
}

export interface Action {
	type: "it" | "describe-start" | "describe-end" | "hook";
}

export interface HookAction extends Action {
	type: "hook";
	cb: AnyCB;
}

export interface ItAction<T extends any[]> extends Action {
	type: "it";
	title: string;
	cb: TestCB<T>;
	args: T;
}

export interface DescribeStartAction {
	type: "describe-start";
	title: string;
}

export interface DescribeEndAction {
	type: "describe-end";
}

export interface Hooks {
	beforeEach: AnyCB;
	afterEach: AnyCB;
}

export interface Colors {
	red: LogFn;
	green: LogFn;
	blue: LogFn;
	bold: LogFn;
	magenta: LogFn;
	grey: LogFn;
}

export interface Context {
	passed: number;
	failed: number;
	totalRuntime: number;
	errors: any[];
}

export class NestedTestError extends Error {}

// Guards

export const isHookAction = (action: Action): action is HookAction => {
	return action.type === "hook";
};

export const isItAction = <T extends any[]>(
	action: Action
): action is ItAction<T> => {
	return action.type === "it";
};

export const isDescribeStartAction = (
	action: Action
): action is DescribeStartAction => {
	return action.type === "describe-start";
};

export const isDescribeEndAction = (
	action: Action
): action is DescribeEndAction => {
	return action.type === "describe-end";
};
