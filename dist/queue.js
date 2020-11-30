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
            _this.hijacker = new hijacker_1.default(_this.logger);
        };
        this.run = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, queue, evaluateTest, startGroup, stopGroup, i, action;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, queue = _a.queue, evaluateTest = _a.evaluateTest, startGroup = _a.startGroup, stopGroup = _a.stopGroup;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 15, 16]);
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < queue.length)) return [3 /*break*/, 14];
                        action = queue[i];
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
                        summarize_1.default(this.logger, this.context, this.config);
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
            var title, cb, args, _a, context, logger, hijacker, runHook, clock, didPass, runtime, err_1, runtime;
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
                        runtime = clock.calc();
                        logger.fail(title, runtime);
                        context.failed += 1;
                        context.errors.push([err_1, title]);
                        if (runtime > 0) {
                            context.testRuntime += runtime;
                        }
                        didPass = false;
                        return [3 /*break*/, 7];
                    case 5:
                        hijacker.releaseTestLog(title, didPass);
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
        this.hijacker = new hijacker_1.default(this.logger);
    }
    return Queue;
}());
exports.default = Queue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE4QjtBQUM5Qix3REFBa0M7QUFDbEMsaUNBQWdDO0FBQ2hDLDBEQUFvQztBQUNwQyxpQ0FjaUI7QUFFakI7SUFLQyxlQUFZLE1BQXFCO1FBQWpDLGlCQUlDO1FBRU0sWUFBTyxHQUFHO1lBQ2hCLE1BQU0sRUFBRSxDQUFDO1lBQ1QsTUFBTSxFQUFFLENBQUM7WUFDVCxXQUFXLEVBQUUsQ0FBQztZQUNkLE1BQU0sRUFBRSxFQUFFO1NBQ1YsQ0FBQztRQUVLLFVBQUssR0FBYSxFQUFFLENBQUM7UUFDckIsZUFBVSxHQUFHLFVBQW1CLE1BQVM7WUFDL0MsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDO1FBRU0saUJBQVksR0FBRyxVQUFDLE9BQStCO1lBQ3RELEtBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDL0IsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEQsS0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7UUFFSyxRQUFHLEdBQUc7Ozs7O3dCQUNOLEtBQWlELElBQUksRUFBbkQsS0FBSyxXQUFBLEVBQUUsWUFBWSxrQkFBQSxFQUFFLFVBQVUsZ0JBQUEsRUFBRSxTQUFTLGVBQUEsQ0FBVTs7Ozt3QkFHbEQsQ0FBQyxHQUFHLENB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O3dCQUdULE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBRTdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO3dCQUU1QixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQzt3QkFFcEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFFbEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFOzRCQUNoQixPQUFPLENBQUMsV0FBVyxJQUFJLE9BQU8sQ0FBQzt5QkFDL0I7d0JBQ0QsT0FBTyxHQUFHLEtBQUssQ0FBQzs7O3dCQUVoQixRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDeEMscUJBQU0sT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsRUFBQTs7d0JBQWpDLFNBQWlDLENBQUM7Ozs7O2FBRW5DLENBQUM7UUE3SkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBMkpGLFlBQUM7QUFBRCxDQUFDLEFBcEtELElBb0tDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcbmltcG9ydCBIaWphY2tlciBmcm9tIFwiLi9oaWphY2tlclwiO1xuaW1wb3J0IHsgQ2xvY2sgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHN1bW1hcml6ZSBmcm9tIFwiLi9zdW1tYXJpemVcIjtcbmltcG9ydCB7XG5cdEFjdGlvbixcblx0SXRBY3Rpb24sXG5cdERlc2NyaWJlU3RhcnRBY3Rpb24sXG5cdGlzRGVzY3JpYmVTdGFydEFjdGlvbixcblx0aXNEZXNjcmliZUVuZEFjdGlvbixcblx0aXNIb29rQWN0aW9uLFxuXHRpc0l0QWN0aW9uLFxuXHRpc0NvbmZpZ3VyYXRpb25BY3Rpb24sXG5cdGlzRG9PbmNlQWN0aW9uLFxuXHRIb29rcyxcblx0SG9va0FjdGlvbixcblx0QW55Q0IsXG5cdENvbmZpZ3VyYXRpb24sXG59IGZyb20gXCIuL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXVlIHtcblx0Y29uZmlnOiBDb25maWd1cmF0aW9uO1xuXHRsb2dnZXI6IExvZ2dlcjtcblx0aGlqYWNrZXI6IEhpamFja2VyO1xuXG5cdGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlndXJhdGlvbikge1xuXHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHRcdHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcih0aGlzLmNvbmZpZyk7XG5cdFx0dGhpcy5oaWphY2tlciA9IG5ldyBIaWphY2tlcih0aGlzLmxvZ2dlcik7XG5cdH1cblxuXHRwdWJsaWMgY29udGV4dCA9IHtcblx0XHRwYXNzZWQ6IDAsXG5cdFx0ZmFpbGVkOiAwLFxuXHRcdHRlc3RSdW50aW1lOiAwLFxuXHRcdGVycm9yczogW10sXG5cdH07XG5cblx0cHVibGljIHF1ZXVlOiBBY3Rpb25bXSA9IFtdO1xuXHRwdWJsaWMgcHVzaEFjdGlvbiA9IDxBIGV4dGVuZHMgQWN0aW9uPihhY3Rpb246IEEpID0+IHtcblx0XHR0aGlzLnF1ZXVlLnB1c2goYWN0aW9uKTtcblx0fTtcblxuXHRwcml2YXRlIHJlbG9hZENvbmZpZyA9IChvcHRpb25zOiBQYXJ0aWFsPENvbmZpZ3VyYXRpb24+KSA9PiB7XG5cdFx0dGhpcy5oaWphY2tlci5yZXNldEdsb2JhbExvZygpO1xuXHRcdHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgb3B0aW9ucyk7XG5cdFx0dGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKHRoaXMuY29uZmlnKTtcblx0XHR0aGlzLmhpamFja2VyID0gbmV3IEhpamFja2VyKHRoaXMubG9nZ2VyKTtcblx0fTtcblxuXHRwdWJsaWMgcnVuID0gYXN5bmMgKCkgPT4ge1xuXHRcdGNvbnN0IHsgcXVldWUsIGV2YWx1YXRlVGVzdCwgc3RhcnRHcm91cCwgc3RvcEdyb3VwIH0gPSB0aGlzO1xuXG5cdFx0dHJ5IHtcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgYWN0aW9uID0gcXVldWVbaV07XG5cblx0XHRcdFx0aWYgKGlzSG9va0FjdGlvbihhY3Rpb24pKSB7XG5cdFx0XHRcdFx0YXdhaXQgYWN0aW9uLmNiKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNJdEFjdGlvbihhY3Rpb24pKSB7XG5cdFx0XHRcdFx0YXdhaXQgZXZhbHVhdGVUZXN0KGFjdGlvbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNEZXNjcmliZVN0YXJ0QWN0aW9uKGFjdGlvbikpIHtcblx0XHRcdFx0XHRhd2FpdCBzdGFydEdyb3VwKGFjdGlvbik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNEZXNjcmliZUVuZEFjdGlvbihhY3Rpb24pKSB7XG5cdFx0XHRcdFx0YXdhaXQgc3RvcEdyb3VwKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoaXNEb09uY2VBY3Rpb24oYWN0aW9uKSkge1xuXHRcdFx0XHRcdGF3YWl0IGFjdGlvbi5jYigpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGlzQ29uZmlndXJhdGlvbkFjdGlvbihhY3Rpb24pKSB7XG5cdFx0XHRcdFx0dGhpcy5yZWxvYWRDb25maWcoYWN0aW9uLmNvbmZpZ3VyYXRpb24pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdHN1bW1hcml6ZSh0aGlzLmxvZ2dlciwgdGhpcy5jb250ZXh0LCB0aGlzLmNvbmZpZyk7XG5cdFx0fVxuXHR9O1xuXG5cdHByaXZhdGUgaG9va3M6IEhvb2tzID0ge1xuXHRcdGJlZm9yZUVhY2g6ICgpID0+IHt9LFxuXHRcdGFmdGVyRWFjaDogKCkgPT4ge30sXG5cdH07XG5cblx0cHJpdmF0ZSBob29rc0NhY2hlOiBIb29rc1tdID0gW107XG5cblx0cHVibGljIHVzZUNhY2hlZEhvb2tzID0gKCkgPT4ge1xuXHRcdHRoaXMuaG9va3MgPSBPYmplY3QuYXNzaWduKHRoaXMuaG9va3MsIHRoaXMuaG9va3NDYWNoZS5wb3AoKSk7XG5cdH07XG5cblx0cHVibGljIGNhY2hlQW5kUmVzZXRIb29rcyA9ICgpID0+IHtcblx0XHR0aGlzLmhvb2tzQ2FjaGUucHVzaCh7IC4uLnRoaXMuaG9va3MgfSk7XG5cblx0XHRpZiAodGhpcy5jb25maWcuYnViYmxlSG9va3MgIT09IHRydWUpIHtcblx0XHRcdGZvciAoY29uc3QgaG9vayBpbiB0aGlzLmhvb2tzKSB7XG5cdFx0XHRcdHRoaXMuaG9va3NbaG9va10gPSAoKSA9PiB7fTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0cHVibGljIHJ1bkhvb2sgPSBhc3luYyAoaG9va05hbWU6IGtleW9mIEhvb2tzLCB0ZXN0TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0dGhpcy5oaWphY2tlci5oaWphY2tDb25zb2xlTG9ncygpO1xuXG5cdFx0YXdhaXQgdGhpcy5ob29rc1tob29rTmFtZV0oKTtcblxuXHRcdHRoaXMuaGlqYWNrZXIucmVsZWFzZUhvb2tMb2coaG9va05hbWUsIHRlc3ROYW1lKTtcblx0fTtcblxuXHRwdWJsaWMgcHVzaEhvb2tBY3Rpb24gPSAoaG9va05hbWU6IGtleW9mIEhvb2tzLCBjYjogQW55Q0IpID0+IHtcblx0XHRjb25zdCBhY3Rpb246IEhvb2tBY3Rpb24gPSB7XG5cdFx0XHR0eXBlOiBcImhvb2tcIixcblx0XHRcdGNiOiAoKSA9PiB7XG5cdFx0XHRcdHRoaXMuaG9va3NbaG9va05hbWVdID0gY2I7XG5cdFx0XHR9LFxuXHRcdH07XG5cdFx0dGhpcy5wdXNoQWN0aW9uKGFjdGlvbik7XG5cdH07XG5cblx0cHJpdmF0ZSBzdGFydEdyb3VwID0gYXN5bmMgKGdyb3VwOiBEZXNjcmliZVN0YXJ0QWN0aW9uKSA9PiB7XG5cdFx0Y29uc3QgeyBsb2dnZXIsIGNhY2hlQW5kUmVzZXRIb29rcyB9ID0gdGhpcztcblx0XHRsb2dnZXIubG9nR3JvdXBUaXRsZShncm91cC50aXRsZSk7XG5cdFx0Y2FjaGVBbmRSZXNldEhvb2tzKCk7XG5cdH07XG5cblx0cHJpdmF0ZSBzdG9wR3JvdXAgPSBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgeyBsb2dnZXIsIHVzZUNhY2hlZEhvb2tzIH0gPSB0aGlzO1xuXHRcdGxvZ2dlci5zdWJ0cmFjdFBhZGRpbmcoKTtcblx0XHR1c2VDYWNoZWRIb29rcygpO1xuXHR9O1xuXG5cdHByaXZhdGUgZXZhbHVhdGVUZXN0ID0gYXN5bmMgPFQgZXh0ZW5kcyBhbnlbXT4oXG5cdFx0YWN0aW9uOiBJdEFjdGlvbjxUPlxuXHQpOiBQcm9taXNlPHZvaWQ+ID0+IHtcblx0XHRjb25zdCB7IHRpdGxlLCBjYiwgYXJncyB9ID0gYWN0aW9uO1xuXG5cdFx0Y29uc3QgeyBjb250ZXh0LCBsb2dnZXIsIGhpamFja2VyLCBydW5Ib29rIH0gPSB0aGlzO1xuXG5cdFx0YXdhaXQgcnVuSG9vayhcImJlZm9yZUVhY2hcIiwgdGl0bGUpO1xuXG5cdFx0aGlqYWNrZXIuaGlqYWNrQ29uc29sZUxvZ3MoKTtcblxuXHRcdGNvbnN0IGNsb2NrID0gbmV3IENsb2NrKCk7XG5cblx0XHRsZXQgZGlkUGFzczogYm9vbGVhbjtcblx0XHR0cnkge1xuXHRcdFx0YXdhaXQgY2IoLi4uYXJncyk7XG5cblx0XHRcdC8vIFBhc3Ncblx0XHRcdGNvbnN0IHJ1bnRpbWUgPSBjbG9jay5jYWxjKCk7XG5cblx0XHRcdGxvZ2dlci5wYXNzKHRpdGxlLCBydW50aW1lKTtcblxuXHRcdFx0Y29udGV4dC5wYXNzZWQgKz0gMTtcblxuXHRcdFx0aWYgKHJ1bnRpbWUgPiAwKSB7XG5cdFx0XHRcdGNvbnRleHQudGVzdFJ1bnRpbWUgKz0gcnVudGltZTtcblx0XHRcdH1cblx0XHRcdGRpZFBhc3MgPSB0cnVlO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0Ly8gRmFpbFxuXHRcdFx0Y29uc3QgcnVudGltZSA9IGNsb2NrLmNhbGMoKTtcblxuXHRcdFx0bG9nZ2VyLmZhaWwodGl0bGUsIHJ1bnRpbWUpO1xuXG5cdFx0XHRjb250ZXh0LmZhaWxlZCArPSAxO1xuXG5cdFx0XHRjb250ZXh0LmVycm9ycy5wdXNoKFtlcnIsIHRpdGxlXSk7XG5cblx0XHRcdGlmIChydW50aW1lID4gMCkge1xuXHRcdFx0XHRjb250ZXh0LnRlc3RSdW50aW1lICs9IHJ1bnRpbWU7XG5cdFx0XHR9XG5cdFx0XHRkaWRQYXNzID0gZmFsc2U7XG5cdFx0fSBmaW5hbGx5IHtcblx0XHRcdGhpamFja2VyLnJlbGVhc2VUZXN0TG9nKHRpdGxlLCBkaWRQYXNzKTtcblx0XHRcdGF3YWl0IHJ1bkhvb2soXCJhZnRlckVhY2hcIiwgdGl0bGUpO1xuXHRcdH1cblx0fTtcbn1cbiJdfQ==