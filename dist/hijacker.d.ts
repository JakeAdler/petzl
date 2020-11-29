import Logger from "./logger";
import { Colors, Hooks, LogFn } from "./types";
export default class Hijacker {
    symbols: boolean;
    logFn: LogFn;
    log: LogFn;
    colors: Colors;
    volume: number;
    addPadding: () => void;
    subtractPadding: () => void;
    constructor(logger: Logger);
    capturedLogs: any[];
    hijackConsoleLogs: () => void;
    releaseHookLog: (hookName: keyof Hooks, testName: string) => void;
    releaseTestLog: (title: string, pass: boolean) => void;
    resetGlobalLog: () => void;
}
