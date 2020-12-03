"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Hijacker = /** @class */ (function () {
    function Hijacker(logger, config) {
        var _this = this;
        this.capturedLogs = [];
        this.hijackConsoleLogs = function () {
            if (!_this.dev) {
                global.console.log = function () {
                    var _a;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    (_a = _this.capturedLogs).push.apply(_a, args);
                };
            }
            else {
                global.console.log = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    _this.logFn.apply(_this, args);
                };
            }
        };
        this.releaseCaputredlogs = function () {
            var capturedLen = _this.capturedLogs.length;
            for (var i = 0; i < capturedLen; i++) {
                var message = _this.capturedLogs[i];
                if (i === capturedLen - 1) {
                    _this.log("└ ", message);
                }
                else {
                    _this.log("│ ", message);
                }
            }
        };
        // Release logs captured by hooks
        this.releaseHookLog = function (hookName, testName) {
            global.console.log = _this.log;
            if (_this.capturedLogs.length && _this.volume >= 2) {
                _this.log(_this.colors.blue(hookName + " (" + testName + "):"));
                _this.releaseCaputredlogs();
            }
            _this.capturedLogs = [];
        };
        // Release logs captured by test
        this.releaseTestLog = function (title, runtime, pass) {
            global.console.log = _this.log;
            if (_this.volume >= 2) {
                var capturedLen = _this.capturedLogs.length;
                if (_this.volume === 2 && capturedLen) {
                    _this[pass ? "pass" : "fail"](title, runtime, true);
                }
                _this.releaseCaputredlogs();
            }
            _this.capturedLogs = [];
        };
        this.resetGlobalLog = function () {
            global.console.log = _this.logFn;
            _this.capturedLogs = [];
        };
        this.log = logger.log;
        this.pass = logger.pass;
        this.fail = logger.fail;
        this.logFn = logger.logFn;
        this.colors = logger.colors;
        this.volume = config.volume;
        this.dev = config.dev === false ? false : true;
    }
    return Hijacker;
}());
exports.default = Hijacker;
//# sourceMappingURL=hijacker.js.map