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
Object.defineProperty(exports, "__esModule", { value: true });
(function UMD(context, definition) {
    // prettier-ignore
    //@ts-ignore
    if (typeof define === "function" && define.amd) {
        define(definition);
    }
    //@ts-ignore
    else if (typeof module !== "undefined" && module.exports) {
        module.exports = definition();
    }
    else {
        Object.assign(context, definition());
    }
})(this, function DEF() {
    const chalk = require("chalk");
    const { inspect } = require("util");
    const { AssertionError } = require("assert");
    // Type guards
    const isAssertionError = (error) => {
        return error instanceof AssertionError;
    };
    let context = {
        passed: 0,
        failed: 0,
        totalRuntime: 0,
        errors: [],
    };
    const log = console.log;
    let options = {
        passMessage: (title, runtime) => {
            log(chalk.green("PASSED: "), title, chalk.green(`(${runtime}ms)`));
        },
        onPass: () => { },
        failMessage: (title, runtime, error) => {
            log(chalk.red("FAILED: "), title, chalk.red(`(${runtime}ms)`));
        },
        onFail: () => { },
        seperator: () => {
            log(chalk.magenta("====================================="));
        },
        errorTitle: (title, error, index) => {
            log(chalk.red.bold.underline(`Failed #${index + 1} - ${title}`));
        },
        errorMessage: (error) => {
            if (isAssertionError(error)) {
                const expected = typeof error.expected === "object"
                    ? inspect(error.expected, false, 1)
                    : error.expected;
                const actual = typeof error.actual === "object"
                    ? inspect(error.actual, false, 1)
                    : error.actual;
                console.log(chalk.green(`    expected: ${expected}`));
                console.log(chalk.red(`    recieved: ${actual}`));
            }
            else {
                console.log(error);
            }
        },
    };
    const testManger = {
        pass: (title, runtime) => {
            options.passMessage(title, runtime);
            options.onPass();
            context.passed += 1;
            context.totalRuntime += runtime;
        },
        fail: (title, runtime, error) => {
            // If user forgot to restore clock, do it here
            options.failMessage(title, runtime, error);
            options.onFail();
            context.failed += 1;
            context.totalRuntime += runtime;
            context.errors.push([error, title]);
        },
        get: () => {
            const { errors } = context, count = __rest(context, ["errors"]);
            if (errors) {
                for (let i = 0; i < errors.length; i++) {
                    const [error, title] = errors[i];
                    options.seperator();
                    console.log("\n");
                    options.errorMessage(title, error, i);
                    console.log("\n");
                }
                options.seperator();
            }
            console.log(chalk.green.bold(`Passed: ${context.passed}`));
            console.log(chalk.red.bold(`Failed: ${context.failed}`));
            console.log(chalk.blue.bold(`Runtime: ${context.totalRuntime}ms`));
        },
    };
    const test = (title, cb, ...args) => __awaiter(this, void 0, void 0, function* () {
        let startTime;
        let endTime;
        const calcRunTime = () => Math.round(endTime - startTime);
        try {
            startTime = performance.now();
            // Run test
            yield test.before();
            yield cb(...args);
            endTime = performance.now();
            testManger.pass(title, calcRunTime());
        }
        catch (err) {
            endTime = performance.now();
            testManger.fail(title, calcRunTime(), err);
        }
    });
    test.before = () => { };
    return { test };
});
