"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hijacker {
    constructor(logger) {
        this.capturedLogs = [];
        this.hijackConsoleLogs = () => {
            global.console.log = (...args) => {
                this.capturedLogs.push(...args);
            };
        };
        // Release logs captured by hooks
        this.releaseHookLog = (hookName, testName) => {
            global.console.log = this.log;
            if (this.capturedLogs.length && this.volume >= 2) {
                this.log(this.colors.blue(`${hookName} (${testName}):`));
                this.addPadding();
                for (const message of this.capturedLogs) {
                    if (this.symbols !== false) {
                        this.log("- ", message);
                    }
                    else {
                        this.log(message);
                    }
                }
                this.subtractPadding();
            }
            this.capturedLogs = [];
        };
        // Release logs captured by test
        this.releaseTestLog = (title, pass) => {
            global.console.log = this.log;
            if (this.volume >= 2) {
                if (this.capturedLogs.length) {
                    if (this.volume === 2) {
                        this.log(this.colors[pass ? "green" : "red"](title));
                    }
                    for (const message of this.capturedLogs) {
                        if (this.symbols !== false) {
                            this.log("* ", message);
                        }
                        else {
                            this.log(message);
                        }
                    }
                }
            }
            this.capturedLogs = [];
        };
        this.resetGlobalLog = () => {
            global.console.log = this.logFn;
            this.capturedLogs = [];
        };
        this.log = logger.log;
        this.logFn = logger.logFn;
        this.colors = logger.colors;
        this.volume = logger.volume;
        this.addPadding = logger.addPadding;
        this.subtractPadding = logger.subtractPadding;
        this.symbols = logger.symbols;
    }
}
exports.default = Hijacker;
