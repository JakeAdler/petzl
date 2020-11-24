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
const clock = {
    startTime: 0,
    endTime: 0,
    start: () => {
        clock.startTime = perf_hooks_1.performance.now();
    },
    stop: () => {
        clock.endTime = perf_hooks_1.performance.now();
    },
    calc: () => {
        return Math.round(Math.abs(clock.endTime - clock.startTime));
    },
};
const test = (title, cb, ...args) => {
    const AsyncFunction = (() => __awaiter(void 0, void 0, void 0, function* () { })).constructor;
    if (cb["then"] && typeof cb["then"] === "function") {
        console.log("ASYNC");
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const formattedTitle = getTitle(title, ...args);
                try {
                    clock.start();
                    try {
                        log_1.hijackLogs();
                        yield cb(...args);
                    }
                    finally {
                        log_1.restoreLogs();
                    }
                    clock.stop();
                    testManager_1.default.pass(formattedTitle, clock.calc());
                }
                catch (err) {
                    testManager_1.default.fail(formattedTitle, clock.calc(), err);
                }
                finally {
                    log_1.printLogs();
                }
            }
            finally {
                resolve();
            }
        }));
    }
    else {
    }
};
exports.default = test;
