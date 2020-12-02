"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var assert_1 = require("assert");
var table_1 = require("table");
var summarize = function (logger, context, configuration) {
    var flushPadding = logger.flushPadding, log = logger.logFn, colors = logger.colors;
    var errors = context.errors;
    flushPadding();
    if (errors.length) {
        log("\n");
        for (var i = 0; i < errors.length; i++) {
            var _a = errors[i], error = _a[0], title = _a[1];
            log(colors.red(colors.bold("Failed #" + (i + 1) + " - " + title)));
            var pathWithLineNumber = error.stack
                .split("at ")[1]
                .replace(process.cwd() + "/", "");
            log("    @ " + pathWithLineNumber.trim());
            var expected = typeof error.expected === "object"
                ? util_1.inspect(error.expected, false, 1)
                : error.expected;
            var actual = typeof error.actual === "object"
                ? util_1.inspect(error.actual, false, 1)
                : error.actual;
            if (error instanceof assert_1.AssertionError) {
                log("   ", error.message.split(":")[0]);
                log(colors.green("    expected: " + expected));
                log(colors.red("    recieved: " + actual));
            }
            else {
                log(error);
            }
            log("\n");
        }
    }
    else {
        log("\n");
    }
    var passed = [
        colors.green(colors.bold("Passed")),
        colors.green(context.passed.toString()),
    ];
    var faied = [
        colors.red(colors.bold("Failed")),
        colors.red(context.failed.toString()),
    ];
    var runtime = [
        colors.blue(colors.bold("Runtime")),
        colors.blue(context.testRuntime + "ms"),
    ];
    var processRuntime = [
        colors.blue(colors.bold("Process Runtime")),
        colors.blue(process.uptime().toFixed(1) + "s"),
    ];
    var endReport = [passed, faied, runtime, processRuntime];
    log(table_1.table(endReport, { border: table_1.getBorderCharacters("norc") }));
};
exports.default = summarize;
//# sourceMappingURL=summarize.js.map