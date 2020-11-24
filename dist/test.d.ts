declare type Test<T extends any[]> = (...args: T) => Promise<void> | void;
declare type Title<T extends any[]> = string | ((...args: Partial<T>) => string);
declare const test: <T extends any[]>(title: Title<T>, cb: Test<T>, ...args: T) => Promise<void>;
export default test;
