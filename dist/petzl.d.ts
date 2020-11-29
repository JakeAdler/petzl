import { AnyCB, Configuration, Title, TestCB } from "./types";
declare class Petzl {
    private logger;
    private hijacker;
    private config;
    constructor(configuration?: Configuration);
    private applyConfiguration;
    private context;
    private hooks;
    private hooksCache;
    private useCachedHooks;
    private pushHookToQueue;
    private cacheAndResetHooks;
    private runHook;
    beforeEach: (cb: AnyCB) => void;
    afterEach: (cb: AnyCB) => void;
    private queue;
    private runQueue;
    private startGroup;
    private stopGroup;
    private evaluateTest;
    configure: (options: Partial<Configuration>) => void;
    it: <T extends any[]>(title: Title<T>, cb: TestCB<T>, ...args: T) => void;
    describe: <T extends any[]>(title: Title<T>, cb: (...args: T) => void, ...args: T) => void;
}
export default Petzl;
