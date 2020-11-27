export type AnyCB<T extends any[]> = (...macroArgs: T) => Promise<void> | void;

export type LogFn = (...args: any[]) => void;

export type Title<T extends any[]> = string | ((...args: Partial<T>) => string);

export interface Configuration {
	logger?: Pick<Console, "log">;
	colors?: boolean;
	format?: boolean;
	symbols?: boolean;
	autoRun?: boolean;
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
