import { AnyVoidCB, Configuration, Title, TestCB, AnyCB } from "./types";
import Collector from "./collector";
declare class Petzl {
    private runner;
    private configurer;
    collector: Collector;
    constructor(configuration?: Configuration);
    beforeEach: (cb: AnyVoidCB) => void;
    afterEach: (cb: AnyVoidCB) => void;
    doOnce: (cb: AnyCB) => void;
    configure: (options: Omit<Configuration, "collector" | "require">) => void;
    it: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => void;
    describe: <T extends any[]>(title: Title<T>, cb: (...args: T) => void, ...args: T) => void;
}
declare const it: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => void, describe: <T extends any[]>(title: Title<T>, cb: (...args: T) => void, ...args: T) => void, beforeEach: (cb: AnyVoidCB) => void, afterEach: (cb: AnyVoidCB) => void, doOnce: (cb: AnyCB) => void, configure: (options: Omit<Configuration, "collector" | "require">) => void, collector: Collector;
export { it, describe, beforeEach, afterEach, doOnce, configure, collector, Petzl, };
