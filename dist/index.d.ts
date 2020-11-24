declare type TestCB<T extends any[]> = (...args: T) => Promise<void> | void;
declare type Title<T extends any[]> = string | ((...args: Partial<T>) => string);
declare const test: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => Promise<void> | void, group: (title: string, cb: () => Promise<void> | void) => Promise<void>, report: () => void;
export { test, group, report };
