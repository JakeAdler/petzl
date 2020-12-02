import { LogFn, Configuration } from "./types";
export declare type ColorFn = (...args: any[]) => string;
export interface Colors {
    underline: ColorFn;
    red: ColorFn;
    green: ColorFn;
    blue: ColorFn;
    bold: ColorFn;
    magenta: ColorFn;
    grey: ColorFn;
}
export default class Logger {
    logFn: LogFn;
    colors: Colors;
    volume: number;
    padding: string;
    constructor(configuration: Configuration);
    addPadding: () => void;
    subtractPadding: () => void;
    flushPadding: () => void;
    logQueue: any[];
    dumpLogs: () => void;
    log: (...args: any[]) => void;
    pass: (title: string, runtime: number, force?: boolean) => void;
    fail: (title: string, runtime: number, force?: boolean) => void;
    logGroupTitle: (title: string) => void;
    logTestFileName: (fileName: string) => void;
    logFileOrDirname: (fileOrDir: "file" | "directory", name: string) => void;
}
