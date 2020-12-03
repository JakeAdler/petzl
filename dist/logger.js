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
var LogCache = /** @class */ (function () {
    function LogCache() {
        var _this = this;
        this.padding = "";
        this.logQueue = [];
        this.update = function (logger) {
            _this.padding = logger.padding;
            _this.logQueue = logger.logQueue;
        };
    }
    return LogCache;
}());
var cache = new LogCache();
var Logger = /** @class */ (function () {
    function Logger(configuration) {
        var _this = this;
        this.addPadding = function () {
            _this.padding += "  ";
            cache.update(_this);
        };
        this.subtractPadding = function () {
            if (_this.padding.length === 2) {
                _this.padding = "";
            }
            else {
                _this.padding = _this.padding.slice(0, _this.padding.length - 2);
            }
            cache.update(_this);
        };
        this.flushPadding = function () {
            _this.padding = "";
            cache.update(_this);
        };
        this.dumpLogs = function () {
            for (var _i = 0, _a = _this.logQueue; _i < _a.length; _i++) {
                var logs = _a[_i];
                _this.logFn.apply(_this, logs);
            }
        };
        this.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (_this.volume === 3) {
                var paddedArg = args[0], rest = args.slice(1);
                _this.logQueue.push(__spreadArrays(["" + _this.padding + paddedArg], rest));
            }
            if (_this.volume <= 2) {
                _this.logQueue.push(args);
            }
            cache.update(_this);
        };
        this.pass = function (title, runtime, force) {
            if (_this.volume >= 3 || force) {
                _this.log(_this.colors.green("🗸"), title, _this.colors.green("(" + runtime + "ms)"));
            }
        };
        this.fail = function (title, runtime, force) {
            if (_this.volume >= 3 || force) {
                _this.log(_this.colors.red("✘"), title, _this.colors.red("(" + runtime + "ms)"));
            }
        };
        this.logGroupTitle = function (title) {
            if (_this.volume >= 3) {
                _this.log(_this.colors.bold(_this.colors.underline(title)));
            }
        };
        this.logTestFileName = function (fileName) {
            if (_this.volume >= 3) {
                var shortPath = fileName.replace(process.cwd(), "");
                _this.log(_this.colors.bold(_this.colors.underline(shortPath)));
            }
        };
        this.logFileOrDirname = function (fileOrDir, name) {
            _this.logFn(_this.colors.bold(_this.colors.underline("Running " + fileOrDir + " " + name)));
        };
        var colors = configuration.colors, volume = configuration.volume, dev = configuration.dev;
        if (dev !== false) {
            this.logFn = dev.logger.log;
            this.padding = "";
            this.logQueue = [];
        }
        else {
            this.logFn = console.log;
            this.padding = cache.padding;
            this.logQueue = cache.logQueue;
        }
        this.volume = volume;
        this.colors = utils_1.createColors(colors);
    }
    return Logger;
}());
exports.default = Logger;
//# sourceMappingURL=logger.js.map