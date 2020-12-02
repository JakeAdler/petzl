import Logger from "./logger";
import { Configuration, Hooks } from "./types";
export default class Hijacker {
    log: Logger["log"];
    pass: Logger["pass"];
    fail: Logger["fail"];
    logFn: Logger["logFn"];
    colors: Logger["colors"];
    volume: number;
    symbols: boolean;
    constructor(logger: Logger, config: Configuration);
    capturedLogs: any[];
    hijackConsoleLogs: () => void;
    private releaseCaputredlogs;
    releaseHookLog: (hookName: keyof Hooks, testName: string) => void;
    releaseTestLog: (title: string, runtime: number, pass: boolean) => void;
    resetGlobalLog: () => void;
}
