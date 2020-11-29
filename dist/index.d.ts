import Petzl from "./petzl";
declare const petzl: Petzl;
declare const it: <T extends any[]>(title: import("./types").Title<T>, cb: import("./types").TestCB<T>, ...args: T) => void, describe: <T extends any[]>(title: import("./types").Title<T>, cb: (...args: T) => void, ...args: T) => void, beforeEach: (cb: import("./types").AnyCB) => void, afterEach: (cb: import("./types").AnyCB) => void, configure: (options: Partial<import("./types").Configuration>) => void;
export { it, describe, beforeEach, afterEach, configure, Petzl };
export default petzl;
