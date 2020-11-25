import Petzl from "./petzl";
import summarize from "./summarize";
export default Petzl;
declare const it: <T extends any[]>(title: import("./types").Title<T>, cb: import("./types").AnyCB<T>, ...args: T) => void | Promise<void>, describe: <T extends any[]>(title: import("./types").Title<T>, cb: import("./types").AnyCB<T>, ...args: T) => Promise<void>, configure: (options: Partial<import("./types").Configuration>) => void, explode: (message: string) => never;
export { it, describe, configure, explode, summarize };
