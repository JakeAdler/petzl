"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const log_1 = require("./log");
const testManager_1 = __importDefault(require("./testManager"));
const test = (title, cb, ...args) => {
    const AsyncFunction = (() => __awaiter(void 0, void 0, void 0, function* () { })).constructor;
    if (cb instanceof AsyncFunction) {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let startTime;
                let endTime;
                const oldConsoleLog = console.log;
                let logs = [];
                const calcRunTime = () => Math.round(endTime - startTime);
                try {
                    startTime = perf_hooks_1.performance.now();
                    yield test.before();
                    try {
                        global.console.log = (...message) => logs.push(...message);
                        yield cb(...args);
                    }
                    finally {
                        global.console.log = oldConsoleLog;
                    }
                    endTime = perf_hooks_1.performance.now();
                    testManager_1.default.pass(title, calcRunTime());
                }
                catch (err) {
                    endTime = perf_hooks_1.performance.now();
                    testManager_1.default.fail(title, calcRunTime(), err);
                }
                finally {
                    if (logs.length) {
                        for (const message of logs) {
                            log_1.log("* ", message);
                        }
                    }
                }
            }
            finally {
                resolve();
            }
        }));
    }
    else {
        let startTime;
        let endTime;
        const oldConsoleLog = console.log;
        let logs = [];
        const calcRunTime = () => Math.round(endTime - startTime);
        try {
            startTime = perf_hooks_1.performance.now();
            test.before();
            try {
                global.console.log = (...message) => logs.push(...message);
                cb(...args);
            }
            finally {
                global.console.log = oldConsoleLog;
            }
            endTime = perf_hooks_1.performance.now();
            testManager_1.default.pass(title, calcRunTime());
        }
        catch (err) {
            endTime = perf_hooks_1.performance.now();
            testManager_1.default.fail(title, calcRunTime(), err);
        }
        finally {
            if (logs.length) {
                for (const message of logs) {
                    log_1.log("* ", message);
                }
            }
        }
    }
};
test.before = () => { };
test.after = () => { };
exports.default = test;
