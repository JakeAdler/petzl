"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hijacker = /** @class */ (function () {
    function Hijacker(logger) {
        var _this = this;
        this.capturedLogs = [];
        this.hijackConsoleLogs = function () {
            global.console.log = function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = _this.capturedLogs).push.apply(_a, args);
            };
        };
        // Release logs captured by hooks
        this.releaseHookLog = function (hookName, testName) {
            global.console.log = _this.log;
            if (_this.capturedLogs.length && _this.volume >= 2) {
                _this.log(_this.colors.blue(hookName + " (" + testName + "):"));
                _this.addPadding();
                for (var _i = 0, _a = _this.capturedLogs; _i < _a.length; _i++) {
                    var message = _a[_i];
                    if (_this.symbols !== false) {
                        _this.log("- ", message);
                    }
                    else {
                        _this.log(message);
                    }
                }
                _this.subtractPadding();
            }
            _this.capturedLogs = [];
        };
        // Release logs captured by test
        this.releaseTestLog = function (title, pass) {
            global.console.log = _this.log;
            if (_this.volume >= 2) {
                if (_this.capturedLogs.length) {
                    if (_this.volume === 2) {
                        _this.log(_this.colors[pass ? "green" : "red"](title));
                    }
                    for (var _i = 0, _a = _this.capturedLogs; _i < _a.length; _i++) {
                        var message = _a[_i];
                        if (_this.symbols !== false) {
                            _this.log("* ", message);
                        }
                        else {
                            _this.log(message);
                        }
                    }
                }
            }
            _this.capturedLogs = [];
        };
        this.resetGlobalLog = function () {
            global.console.log = _this.logFn;
            _this.capturedLogs = [];
        };
        this.log = logger.log;
        this.logFn = logger.logFn;
        this.colors = logger.colors;
        this.volume = logger.volume;
        this.addPadding = logger.addPadding;
        this.subtractPadding = logger.subtractPadding;
        this.symbols = logger.symbols;
    }
    return Hijacker;
}());
exports.default = Hijacker;
//# sourceMappingURL=hijacker.js.map