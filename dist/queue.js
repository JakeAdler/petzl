"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./logger"));
var hijacker_1 = __importDefault(require("./hijacker"));
var utils_1 = require("./utils");
var summarize_1 = __importDefault(require("./summarize"));
var types_1 = require("./types");
var Queue = /** @class */ (function () {
    function Queue(config) {
        var _this = this;
        this.context = {
            passed: 0,
            failed: 0,
            testRuntime: 0,
            errors: [],
        };
        this.queue = [];
        this.pushAction = function (action) {
            _this.queue.push(action);
        };
        this.reloadConfig = function (options) {
            _this.hijacker.resetGlobalLog();
            _this.config = Object.assign(_this.config, options);
            _this.logger = new logger_1.default(_this.config);
            _this.hijacker = new hijacker_1.default(_this.logger, _this.config);
        };
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, queue, evaluateTest, startGroup, stopGroup, i, action;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, queue = _a.queue, evaluateTest = _a.evaluateTest, startGroup = _a.startGroup, stopGroup = _a.stopGroup;
                        this.summarizer.updateSummary(this.context, this.queue);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 15, 16]);
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < queue.length)) return [3 /*break*/, 14];
                        action = queue[i];
                        this.summarizer.clearSummary();
                        if (i !== queue.length - 1) {
                            this.summarizer.updateSummary(this.context, this.queue);
                        }
                        if (!types_1.isHookAction(action)) return [3 /*break*/, 4];
                        return [4 /*yield*/, action.cb()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        if (!types_1.isItAction(action)) return [3 /*break*/, 6];
                        return [4 /*yield*/, evaluateTest(action)];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        if (!types_1.isDescribeStartAction(action)) return [3 /*break*/, 8];
                        return [4 /*yield*/, startGroup(action)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        if (!types_1.isDescribeEndAction(action)) return [3 /*break*/, 10];
                        return [4 /*yield*/, stopGroup()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        if (!types_1.isDoOnceAction(action)) return [3 /*break*/, 12];
                        return [4 /*yield*/, action.cb()];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12:
                        if (types_1.isConfigurationAction(action)) {
                            this.reloadConfig(action.configuration);
                        }
                        _b.label = 13;
                    case 13:
                        i++;
                        return [3 /*break*/, 2];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        this.logger.dumpLogs();
                        this.summarizer.endReport(this.context);
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        }); };
        this.hooks = {
            beforeEach: function () { },
            afterEach: function () { },
        };
        this.hooksCache = [];
        this.useCachedHooks = function () {
            _this.hooks = Object.assign(_this.hooks, _this.hooksCache.pop());
        };
        this.cacheAndResetHooks = function () {
            _this.hooksCache.push(__assign({}, _this.hooks));
            if (_this.config.bubbleHooks !== true) {
                for (var hook in _this.hooks) {
                    _this.hooks[hook] = function () { };
                }
            }
        };
        this.runHook = function (hookName, testName) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.hijacker.hijackConsoleLogs();
                        return [4 /*yield*/, this.hooks[hookName]()];
                    case 1:
                        _a.sent();
                        this.hijacker.releaseHookLog(hookName, testName);
                        return [2 /*return*/];
                }
            });
        }); };
        this.pushHookAction = function (hookName, cb) {
            var action = {
                type: "hook",
                cb: function () {
                    _this.hooks[hookName] = cb;
                },
            };
            _this.pushAction(action);
        };
        this.startGroup = function (group) { return __awaiter(_this, void 0, void 0, function () {
            var _a, logger, cacheAndResetHooks;
            return __generator(this, function (_b) {
                _a = this, logger = _a.logger, cacheAndResetHooks = _a.cacheAndResetHooks;
                logger.addPadding();
                logger.logGroupTitle(group.title);
                cacheAndResetHooks();
                return [2 /*return*/];
            });
        }); };
        this.stopGroup = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, logger, useCachedHooks;
            return __generator(this, function (_b) {
                _a = this, logger = _a.logger, useCachedHooks = _a.useCachedHooks;
                logger.subtractPadding();
                useCachedHooks();
                return [2 /*return*/];
            });
        }); };
        this.evaluateTest = function (action) { return __awaiter(_this, void 0, void 0, function () {
            var title, cb, args, _a, context, logger, hijacker, runHook, clock, didPass, runtime, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        title = action.title, cb = action.cb, args = action.args;
                        _a = this, context = _a.context, logger = _a.logger, hijacker = _a.hijacker, runHook = _a.runHook;
                        return [4 /*yield*/, runHook("beforeEach", title)];
                    case 1:
                        _b.sent();
                        hijacker.hijackConsoleLogs();
                        clock = new utils_1.Clock();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, 5, 7]);
                        return [4 /*yield*/, cb.apply(void 0, args)];
                    case 3:
                        _b.sent();
                        // Pass
                        runtime = clock.calc();
                        logger.pass(title, runtime);
                        context.passed += 1;
                        if (runtime > 0) {
                            context.testRuntime += runtime;
                        }
                        didPass = true;
                        return [3 /*break*/, 7];
                    case 4:
                        err_1 = _b.sent();
                        // Fail
                        didPass = false;
                        runtime = clock.calc();
                        logger.fail(title, runtime);
                        context.failed += 1;
                        context.errors.push([err_1, title]);
                        if (runtime > 0) {
                            context.testRuntime += runtime;
                        }
                        return [3 /*break*/, 7];
                    case 5:
                        hijacker.releaseTestLog(title, runtime, didPass);
                        return [4 /*yield*/, runHook("afterEach", title)];
                    case 6:
                        _b.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.config = config;
        this.logger = new logger_1.default(this.config);
        this.hijacker = new hijacker_1.default(this.logger, this.config);
        this.summarizer = new summarize_1.default(this.logger, this.config);
    }
    return Queue;
}());
exports.default = Queue;
//# sourceMappingURL=queue.js.map