"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var util_1 = require("util");
var assert_1 = require("assert");
var Summarizer = /** @class */ (function () {
    function Summarizer(logger, configuration) {
        var _this = this;
        this.logContext = function (context) {
            var _a;
            var colors = _this.logger.colors;
            var passed = [
                colors.green(colors.bold("Passed")),
                colors.green(context.passed.toString()),
            ];
            var faied = [
                colors.red(colors.bold("Failed")),
                colors.red(context.failed.toString()),
            ];
            var endReport = [passed, faied];
            for (var _i = 0, endReport_1 = endReport; _i < endReport_1.length; _i++) {
                var line = endReport_1[_i];
                (_a = _this.logger).logFn.apply(_a, line);
            }
        };
        this.updateSummary = function (context, queue) {
            if (!_this.config.dev) {
                var numTests = queue.filter(function (action) {
                    if (types_1.isItAction(action)) {
                        return action;
                    }
                }).length;
                _this.logger.logFn(_this.logger.colors.yelllow("Running"), context.passed + context.failed + "/" + numTests);
                _this.logContext(context);
            }
        };
        this.clearSummary = function () {
            if (!_this.config.dev) {
                process.stdout.moveCursor(0, -3);
                process.stdout.clearScreenDown();
            }
        };
        this.endReport = function (context) {
            var _a = _this.logger, flushPadding = _a.flushPadding, log = _a.logFn, colors = _a.colors;
            var errors = context.errors;
            flushPadding();
            if (errors.length) {
                log("\n");
                for (var i = 0; i < errors.length; i++) {
                    var _b = errors[i], error = _b[0], title = _b[1];
                    log(colors.red(colors.bold("Failed:  " + title)));
                    _this.logger.addPadding();
                    var pathWithLineNumber = error.stack
                        .split("at ")[1]
                        .replace(process.cwd() + "/", "");
                    log("@ " + pathWithLineNumber.trim());
                    var expected = typeof error.expected === "object"
                        ? util_1.inspect(error.expected, false, 1)
                        : error.expected;
                    var actual = typeof error.actual === "object"
                        ? util_1.inspect(error.actual, false, 1)
                        : error.actual;
                    if (error instanceof assert_1.AssertionError) {
                        log("   ", error.message.split(":")[0]);
                        log(colors.green("expected: " + expected));
                        log(colors.red("recieved: " + actual));
                    }
                    else {
                        log(error);
                    }
                    _this.logger.subtractPadding();
                    log("\n");
                }
            }
            else {
                log("\n");
            }
            _this.logContext(context);
        };
        this.logger = logger;
        this.config = configuration;
    }
    return Summarizer;
}());
exports.default = Summarizer;
//# sourceMappingURL=summarize.js.map