"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createColors = exports.registerProcessEventListeners = exports.Clock = exports.formatTitle = void 0;
var perf_hooks_1 = require("perf_hooks");
var formatTitle = function (title) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (typeof title === "function") {
        title = title.apply(void 0, args);
    }
    return title.trim();
};
exports.formatTitle = formatTitle;
var Clock = /** @class */ (function () {
    function Clock() {
        var _this = this;
        this.startTime = 0;
        this.endTime = 0;
        this.start = function () {
            _this.startTime = perf_hooks_1.performance.now();
        };
        this.calc = function () {
            _this.endTime = perf_hooks_1.performance.now();
            return Math.round(Math.abs(_this.endTime - _this.startTime));
        };
        this.start();
    }
    return Clock;
}());
exports.Clock = Clock;
var registerProcessEventListeners = function () {
    var colors = exports.createColors(true);
    process.on("uncaughtException", function (err) {
        console.log(colors.red("Failed (" + err.name + "): \n"), err.message);
    });
};
exports.registerProcessEventListeners = registerProcessEventListeners;
var createColors = function (real) {
    if (!real) {
        return {
            underline: function (args) { return args; },
            bold: function (args) { return args; },
            red: function (args) { return args; },
            blue: function (args) { return args; },
            green: function (args) { return args; },
            yelllow: function (args) { return args; },
            magenta: function (args) { return args; },
            grey: function (args) { return args; },
        };
    }
    else {
        // prettier-ignore-start
        var reset_1 = "\x1b[0m";
        return {
            underline: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[4m" + args + reset_1;
            },
            bold: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[1m" + args + reset_1;
            },
            red: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[31m" + args + reset_1;
            },
            blue: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[34m" + args + reset_1;
            },
            green: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[32m" + args + reset_1;
            },
            yelllow: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[33m" + args + reset_1;
            },
            magenta: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[35m" + args + reset_1;
            },
            grey: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return "\u001B[90m" + args + reset_1;
            },
        };
        // prettier-ignore-end;
    }
};
exports.createColors = createColors;
//# sourceMappingURL=utils.js.map