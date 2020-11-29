"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clock = exports.formatTitle = void 0;
const perf_hooks_1 = require("perf_hooks");
const formatTitle = (title, ...args) => {
    if (typeof title === "function") {
        title = title(...args);
    }
    return title.trim();
};
exports.formatTitle = formatTitle;
class Clock {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.start = () => {
            this.startTime = perf_hooks_1.performance.now();
        };
        this.calc = () => {
            this.endTime = perf_hooks_1.performance.now();
            return Math.round(Math.abs(this.endTime - this.startTime));
        };
        this.start();
    }
}
exports.Clock = Clock;
