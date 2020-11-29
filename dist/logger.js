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
            if (this.volume >= 2) {
                if (this.volume >= 3 &&
                    this.padding.length &&
                    this.format !== false) {
                    const [paddedArg, ...rest] = args;
                    this.logFn(`${this.padding}${paddedArg}`, ...rest);
                }
                else {
                    this.logFn(...args);
                }
            }
        };
        this.pass = (title, runtime) => {
            if (this.volume >= 3) {
                this.log(this.colors.green("PASSED: "), title, this.colors.green(`(${runtime}ms)`));
            }
        };
        this.fail = (title, runtime) => {
            if (this.volume >= 3) {
                this.log(this.colors.red("FAILED: "), title, this.colors.red(`(${runtime}ms)`));
            }
        };
        this.logGroupTitle = (title) => {
            if (this.volume >= 3) {
                this.log(this.colors.bold(this.colors.underline(title)));
            }
            this.addPadding();
        };
        const { logger, format, colors, symbols, volume } = configuration;
        this.logFn = logger.log;
        this.format = format;
        this.symbols = symbols;
        this.volume = volume;
        if (colors) {
            this.colors = {
                underline: (...args) => chalk_1.default.underline(...args),
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
                underline: (args) => args,
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
