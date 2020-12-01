"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Logger = /** @class */ (function () {
    function Logger(configuration) {
        var _this = this;
        this.padding = "";
        this.addPadding = function () {
            _this.padding += "  ";
        };
        this.subtractPadding = function () {
            if (_this.padding.length === 2) {
                _this.padding = "";
            }
            else {
                _this.padding = _this.padding.slice(0, _this.padding.length - 2);
            }
        };
        this.flushPadding = function () {
            _this.padding = "";
        };
        this.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.volume >= 2) {
                if (_this.volume >= 3 &&
                    _this.padding.length &&
                    _this.format !== false) {
                    var paddedArg = args[0], rest = args.slice(1);
                    _this.logFn.apply(_this, __spreadArrays(["" + _this.padding + paddedArg], rest));
                }
                else {
                    _this.logFn.apply(_this, args);
                }
            }
        };
        this.pass = function (title, runtime) {
            if (_this.volume >= 3) {
                _this.log(_this.colors.green("PASSED: "), title, _this.colors.green("(" + runtime + "ms)"));
            }
        };
        this.fail = function (title, runtime) {
            if (_this.volume >= 3) {
                _this.log(_this.colors.red("FAILED: "), title, _this.colors.red("(" + runtime + "ms)"));
            }
        };
        this.logGroupTitle = function (title) {
            if (_this.volume >= 3) {
                _this.log(_this.colors.bold(_this.colors.underline(title)));
            }
            _this.addPadding();
        };
        this.logTestFileName = function (fileName) {
            if (_this.volume >= 3) {
                var shortPath = fileName.replace(process.cwd(), "");
                _this.logFn(_this.colors.bold(_this.colors.underline(shortPath)));
            }
        };
        var colors = configuration.colors, volume = configuration.volume, dev = configuration.dev;
        if (dev) {
            this.dev = true;
            this.logFn = dev.logger.log;
            this.format = dev.format;
            this.symbols = dev.symbols;
        }
        else {
            this.dev = false;
            this.logFn = console.log;
            this.format = true;
            this.symbols = true;
        }
        this.volume = volume;
        this.colors = utils_1.createColors(colors);
    }
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=logger.js.map