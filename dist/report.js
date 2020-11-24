"use strict";
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
const assert_1 = require("assert");
const chalk_1 = __importDefault(require("chalk"));
const util_1 = require("util");
const testManager_1 = __importDefault(require("./testManager"));
const report = () => {
    const _a = testManager_1.default.get(), { errors } = _a, context = __rest(_a, ["errors"]);
    if (errors) {
        for (let i = 0; i < errors.length; i++) {
            const [error, title] = errors[i];
            console.log(chalk_1.default.magenta("====================================="));
            console.log("\n");
            console.log(chalk_1.default.red.bold.underline(`Failed #${i + 1} - ${title}`));
            const expected = typeof error.expected === "object"
                ? util_1.inspect(error.expected, false, 1)
                : error.expected;
            const actual = typeof error.actual === "object"
                ? util_1.inspect(error.actual, false, 1)
                : error.actual;
            if (error instanceof assert_1.AssertionError) {
                console.log(chalk_1.default.green(`    expected: ${expected}`));
                console.log(chalk_1.default.red(`    recieved: ${actual}`));
            }
            else {
                console.log(error);
            }
            console.log("\n");
        }
        console.log(chalk_1.default.magenta("====================================="));
    }
    console.log(chalk_1.default.green.bold(`Passed: ${context.passed}`));
    console.log(chalk_1.default.red.bold(`Failed: ${context.failed}`));
    console.log(chalk_1.default.blue.bold(`Runtime: ${context.totalRuntime}ms`));
};
exports.default = report;
