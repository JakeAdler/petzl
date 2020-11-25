"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(configuration) {
        this.padding = "";
        this.addPadding = () => {
            this.padding += "  ";
        };
        this.subtractPadding = () => {
            if (this.padding.length === 2) {
                this.padding = "";
            }
            else {
                this.padding = this.padding.slice(0, this.padding.length - 2);
            }
        };
        this.flushPadding = () => {
            this.padding = "";
        };
        this.log = (...args) => {
            if (this.padding.length && this.format !== false) {
                this.logFn(this.padding, ...args);
            }
            else {
                this.logFn(...args);
            }
        };
        this.formatTitle = (title, ...args) => {
            if (typeof title === "function") {
                title = title(...args);
            }
            return title.trim();
        };
        this.capturedLogs = [];
        this.hijackConsoleLogs = () => {
            global.console.log = (...args) => {
                this.capturedLogs.push(...args);
            };
        };
        this.releaseConsoleLogs = () => {
            global.console.log = this.log;
            if (this.capturedLogs.length) {
                for (const message of this.capturedLogs) {
                    if (this.symbols !== false) {
                        this.log("* ", message);
                    }
                    else {
                        this.log(message);
                    }
                }
            }
            this.capturedLogs = [];
        };
        const { logger, format, colors, symbols } = configuration;
        this.logFn = logger;
        this.format = format;
        this.symbols = symbols;
        if (colors) {
            this.colors = {
                bold: (...args) => chalk_1.default.bold(...args),
                red: (...args) => chalk_1.default.red(...args),
                blue: (...args) => chalk_1.default.blue(...args),
                green: (...args) => chalk_1.default.green(...args),
                magenta: (...args) => chalk_1.default.magenta(...args),
                grey: (...args) => chalk_1.default.grey(...args),
            };
        }
        else {
            this.colors = {
                bold: (args) => args,
                red: (args) => args,
                blue: (args) => args,
                green: (args) => args,
                magenta: (args) => args,
                grey: (args) => args,
            };
        }
    }
}
exports.default = Logger;
