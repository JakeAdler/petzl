"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const assert_1 = require("assert");
const table_1 = require("table");
const summarize = (logger, context, configuration) => {
    const { flushPadding, log, colors } = logger;
    const { errors } = context;
    flushPadding();
    let equalSeperator = "";
    let dashSeperator = "";
    if (configuration.symbols !== false) {
        for (let i = 0; i < process.stdout.columns; i++) {
            equalSeperator += "=";
            dashSeperator += "-";
        }
    }
    else {
        equalSeperator = "\n";
        dashSeperator = "\n";
    }
    if (errors.length) {
        log("\n");
        for (let i = 0; i < errors.length; i++) {
            const [error, title] = errors[i];
            log(colors.red(colors.bold(`Failed #${i + 1} - ${title}`)));
            const pathWithLineNumber = error.stack.split("at ")[1];
            log(`    @ ${pathWithLineNumber.trim()}`);
            const expected = typeof error.expected === "object"
                ? util_1.inspect(error.expected, false, 1)
                : error.expected;
            const actual = typeof error.actual === "object"
                ? util_1.inspect(error.actual, false, 1)
                : error.actual;
            if (error instanceof assert_1.AssertionError) {
                log("   ", error.message.split(":")[0]);
                log(colors.green(`    expected: ${expected}`));
                log(colors.red(`    recieved: ${actual}`));
            }
            else {
                log(error);
            }
            if (i !== errors.length - 1) {
                log(colors.grey(dashSeperator));
            }
            else {
                log("\n");
            }
        }
    }
    const passed = [
        colors.green(colors.bold(`Passed`)),
        colors.green(context.passed),
    ];
    const faied = [
        colors.red(colors.bold(`Failed`)),
        colors.red(context.failed),
    ];
    const runtime = [
        colors.blue(colors.bold(`Runtime`)),
        colors.blue(`${context.totalRuntime}ms`),
    ];
    const endReport = [passed, faied, runtime];
    if (configuration.symbols) {
        log(table_1.table(endReport));
    }
    else {
        log(...passed);
        log(...faied);
        log(...runtime);
    }
};
exports.default = summarize;
