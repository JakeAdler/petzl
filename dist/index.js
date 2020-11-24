"use strict";
/* export { default as test } from "./test"; */
/* export { default as group } from "./group"; */
/* export { default as report } from "./report"; */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = exports.group = exports.test = void 0;
const assert_1 = require("assert");
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("util");
const perf_hooks_1 = require("perf_hooks");
const getTitle = (title, ...args) => {
    let rawTitle;
    if (typeof title === "string") {
        rawTitle = title;
    }
    else if (typeof title === "function") {
        rawTitle = title(...args);
    }
    const formattedTitle = rawTitle.trim();
    return formattedTitle;
};
class Logger {
    constructor(logger) {
        this.logCache = (...args) => {
            this.rawLog(...args);
        };
        this.padding = "";
        this.addPadding = () => {
            this.padding += "  ";
        };
        this.subtractPadding = () => {
            this.padding = this.padding.slice(this.padding.length - 2);
        };
        this.log = (...args) => {
            if (this.padding.length) {
                this.rawLog(this.padding, ...args);
            }
            else {
                this.rawLog(...args);
            }
        };
        this.capturedLogs = [];
        this.hijackLogs = () => {
            global.console.log = (...args) => this.capturedLogs.push(...args);
        };
        this.restoreLogs = () => {
            global.console.log = this.logCache;
            this.capturedLogs = [];
        };
        this.printCapturedLogs = () => {
            if (this.capturedLogs.length) {
                for (const message of this.capturedLogs) {
                    this.log("* ", message);
                }
            }
        };
        if (logger) {
            this.rawLog = logger;
        }
        else {
            this.rawLog = console.log;
        }
    }
}
class Clock {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.start = () => {
            this.startTime = perf_hooks_1.performance.now();
        };
        this.stop = () => {
            this.endTime = perf_hooks_1.performance.now();
        };
        this.calc = () => {
            return Math.round(Math.abs(this.endTime - this.startTime));
        };
    }
}
class Petzl {
    constructor() {
        this.logger = new Logger();
        this.log = this.logger.log;
        this.context = {
            passed: 0,
            failed: 0,
            totalRuntime: 0,
            errors: [],
        };
        this.pass = (title, runtime) => {
            this.log(chalk_1.default.green("PASSED: "), title, chalk_1.default.green(`(${runtime}ms)`));
            this.context.passed += 1;
            if (runtime > 0) {
                this.context.totalRuntime += runtime;
            }
        };
        this.fail = (title, runtime, error) => {
            this.log(chalk_1.default.red("FAILED: "), title, chalk_1.default.red(`(${runtime}ms)`));
            this.context.failed += 1;
            this.context.errors.push([error, title]);
            if (runtime > 0) {
                this.context.totalRuntime += runtime;
            }
        };
        this.test = (title, cb, ...args) => {
            const clock = new Clock();
            const AsyncFunction = (() => __awaiter(this, void 0, void 0, function* () { })).constructor;
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const formattedTitle = getTitle(title, ...args);
                    try {
                        clock.start();
                        try {
                            this.logger.hijackLogs();
                            yield cb(...args);
                        }
                        finally {
                            this.logger.restoreLogs();
                        }
                        clock.stop();
                        this.pass(formattedTitle, clock.calc());
                    }
                    catch (err) {
                        this.fail(formattedTitle, clock.calc(), err);
                    }
                    finally {
                        this.logger.printCapturedLogs();
                    }
                }
                finally {
                    resolve();
                }
            }));
        };
        this.group = (title, cb) => {
            const formattedTitle = title.trim() + ":";
            this.log(chalk_1.default.underline.bold(formattedTitle));
            this.logger.addPadding();
            const runGroup = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield cb();
                }
                finally {
                    this.logger.subtractPadding();
                }
            });
            return Promise.resolve(runGroup());
        };
        this.report = () => {
            const _a = this.context, { errors } = _a, context = __rest(_a, ["errors"]);
            if (errors) {
                for (let i = 0; i < errors.length; i++) {
                    const [error, title] = errors[i];
                    this.log(chalk_1.default.magenta("====================================="));
                    this.log("\n");
                    this.log(chalk_1.default.red.bold.underline(`Failed #${i + 1} - ${title}`));
                    const expected = typeof error.expected === "object"
                        ? util_1.inspect(error.expected, false, 1)
                        : error.expected;
                    const actual = typeof error.actual === "object"
                        ? util_1.inspect(error.actual, false, 1)
                        : error.actual;
                    if (error instanceof assert_1.AssertionError) {
                        this.log(chalk_1.default.green(`    expected: ${expected}`));
                        this.log(chalk_1.default.red(`    recieved: ${actual}`));
                    }
                    else {
                        this.log(error);
                    }
                    this.log("\n");
                }
                this.log(chalk_1.default.magenta("====================================="));
            }
            this.log(chalk_1.default.green.bold(`Passed: ${context.passed}`));
            this.log(chalk_1.default.red.bold(`Failed: ${context.failed}`));
            this.log(chalk_1.default.blue.bold(`Runtime: ${context.totalRuntime}ms`));
        };
    }
}
const { test, group, report } = new Petzl();
exports.test = test;
exports.group = group;
exports.report = report;
