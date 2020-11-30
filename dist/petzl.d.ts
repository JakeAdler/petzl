import { AnyVoidCB, Configuration, Title, TestCB, AnyCB } from "./types";
import Runner from "./runner";
declare class Petzl {
    private config;
    private queue;
    runner: Runner;
    constructor(configuration?: Configuration);
    beforeEach: (cb: AnyVoidCB) => void;
    afterEach: (cb: AnyVoidCB) => void;
    doOnce: (cb: AnyCB) => void;
    configure: (options: Omit<Configuration, "autoRun">) => void;
    it: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => void;
    describe: <T extends any[]>(title: Title<T>, cb: (...args: T) => void, ...args: T) => void;
}
declare const it: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => void, describe: <T extends any[]>(title: Title<T>, cb: (...args: T) => void, ...args: T) => void, beforeEach: (cb: AnyVoidCB) => void, afterEach: (cb: AnyVoidCB) => void, doOnce: (cb: AnyCB) => void, configure: (options: Omit<Configuration, "autoRun">) => void, runner: Runner;
export { it, describe, beforeEach, afterEach, doOnce, configure, runner, Petzl, };
