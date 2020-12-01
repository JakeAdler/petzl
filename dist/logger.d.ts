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
    dev: boolean;
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
    logTestFileName: (fileName: string) => void;
}
