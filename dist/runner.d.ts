import Logger from "./logger";
import Hijacker from "./hijacker";
import Configurer from "./configurer";
import Summarizer from "./summarize";
import { Action, Hooks, AnyCB, Configuration } from "./types";
export default class Runner {
    configurer: Configurer;
    config: Configuration;
    logger: Logger;
    hijacker: Hijacker;
    summarizer: Summarizer;
    dev: boolean;
    constructor(configurer: Configurer);
    context: {
        passed: number;
        failed: number;
        testRuntime: number;
        errors: any[];
    };
    queue: Action[];
    pushAction: <A extends Action>(action: A) => void;
    private reloadConfig;
    run: () => Promise<void>;
    private hooks;
    private hooksCache;
    useCachedHooks: () => void;
    cacheAndResetHooks: () => void;
    runHook: (hookName: keyof Hooks, testName: string) => Promise<void>;
    pushHookAction: (hookName: keyof Hooks, cb: AnyCB) => void;
    private startGroup;
    private stopGroup;
    private evaluateTest;
}
