import { Title } from "./types";
export declare const formatTitle: <T extends any[]>(title: Title<T>, ...args: T) => string;
export declare class Clock {
    constructor();
    private startTime;
    private endTime;
    start: () => void;
    calc: () => number;
}
