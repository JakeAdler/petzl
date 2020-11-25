import { LogFn, Colors, Title, Configuration } from "./types";
declare class Logger {
    logFn: LogFn;
    colors: Colors;
    format: boolean;
    symbols: boolean;
    constructor(configuration: Configuration);
    private padding;
    addPadding: () => void;
    subtractPadding: () => void;
    flushPadding: () => void;
    log: (...args: any[]) => void;
    formatTitle: <T extends any[]>(title: Title<T>, ...args: T) => string;
    private capturedLogs;
    hijackConsoleLogs: () => void;
    releaseConsoleLogs: () => void;
}
export default Logger;
