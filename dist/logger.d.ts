import { LogFn, Colors, Configuration } from "./types";
export default class Logger {
    logFn: LogFn;
    colors: Colors;
    format: boolean;
    symbols: boolean;
    volume: number;
    constructor(configuration: Configuration);
    private padding;
    addPadding: () => void;
    subtractPadding: () => void;
    flushPadding: () => void;
    log: (...args: any[]) => void;
    pass: (title: string, runtime: number) => void;
    fail: (title: string, runtime: number) => void;
    logGroupTitle: (title: string) => void;
}
