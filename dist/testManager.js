"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log_1 = require("./log");
let context = {
    passed: 0,
    failed: 0,
    totalRuntime: 0,
    errors: [],
};
const testManger = {
    pass: (title, runtime) => {
        log_1.log(chalk_1.default.green("PASSED: "), title, chalk_1.default.green(`(${runtime}ms)`));
        context.passed += 1;
        context.totalRuntime += runtime;
    },
    fail: (title, runtime, error) => {
        log_1.log(chalk_1.default.red("FAILED: "), title, chalk_1.default.red(`(${runtime}ms)`));
        context.failed += 1;
        context.totalRuntime += runtime;
        context.errors.push([error, title]);
    },
    get: () => {
        return context;
    },
};
exports.default = testManger;
