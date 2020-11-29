export declare type AnyCB = () => Promise<void> | void;
export declare type TestCB<T extends any[]> = (...macroArgs: T) => Promise<void> | void;
export declare type LogFn = (...args: any[]) => void;
export declare type Title<T extends any[]> = string | ((...args: Partial<T>) => string);
export interface Colors {
    underline: LogFn;
    red: LogFn;
    green: LogFn;
    blue: LogFn;
    bold: LogFn;
    magenta: LogFn;
    grey: LogFn;
}
export interface Configuration {
    logger?: Pick<Console, "log">;
    colors?: boolean;
    format?: boolean;
    symbols?: boolean;
    autoRun?: boolean;
    bubbleHooks?: boolean;
    volume?: number;
}
export interface Action {
    type: "it" | "describe-start" | "describe-end" | "hook" | "configure";
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
export interface DescribeStartAction extends Action {
    type: "describe-start";
    title: string;
}
export interface DescribeEndAction extends Action {
    type: "describe-end";
}
export interface ConfigureAction extends Action {
    type: "configure";
    configuration: Partial<Configuration>;
}
export interface Hooks {
    beforeEach: AnyCB;
    afterEach: AnyCB;
}
export interface Context {
    passed: number;
    failed: number;
    totalRuntime: number;
    errors: any[];
}
export declare class NestedTestError extends Error {
}
export declare const isHookAction: (action: Action) => action is HookAction;
export declare const isItAction: <T extends any[]>(action: Action) => action is ItAction<T>;
export declare const isDescribeStartAction: (action: Action) => action is DescribeStartAction;
export declare const isDescribeEndAction: (action: Action) => action is DescribeEndAction;
export declare const isConfigurationAction: (action: Action) => action is ConfigureAction;
