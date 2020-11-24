"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printLogs = exports.restoreLogs = exports.hijackLogs = exports.subtractPadding = exports.addPadding = exports.log = void 0;
let padding = "";
const log = (...messages) => {
    if (padding.length) {
        console.log(padding, ...messages);
    }
    else {
        console.log(...messages);
    }
};
exports.log = log;
const addPadding = () => {
    padding += "  ";
};
exports.addPadding = addPadding;
const subtractPadding = () => {
    padding = padding.slice(0, padding.length - 2);
};
exports.subtractPadding = subtractPadding;
class hijacker {
    constructor() {
        this.logs = [];
        this.originalLog = console.log;
        this.hijackLogs = () => {
            global.console.log = (...args) => this.logs.push(...args);
        };
        this.restoreLogs = () => {
            global.console.log = this.originalLog;
            this.logs = [];
        };
        this.printLogs = () => {
            if (this.logs.length) {
                for (const message of this.logs) {
                    log("* ", message);
                }
            }
        };
    }
}
const { hijackLogs, restoreLogs, printLogs } = new hijacker();
exports.hijackLogs = hijackLogs;
exports.restoreLogs = restoreLogs;
exports.printLogs = printLogs;
