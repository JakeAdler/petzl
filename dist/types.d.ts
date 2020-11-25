export declare type AnyCB<T extends any[]> = (...macroArgs: T) => Promise<void> | void;
export declare type LogFn = (...args: any[]) => void;
export declare type Title<T extends any[]> = string | ((...args: Partial<T>) => string);
export interface Configuration {
    logger?: (...args: any[]) => void;
    autoReport?: boolean;
    colors?: boolean;
    format?: boolean;
    symbols?: boolean;
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
export declare class NestedTestError extends Error {
}
export declare class Explosion extends Error {
}
