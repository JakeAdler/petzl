"use strict";
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Petzl = exports.runner = exports.configure = exports.doOnce = exports.afterEach = exports.beforeEach = exports.describe = exports.it = void 0;
var utils_1 = require("./utils");
var queue_1 = __importDefault(require("./queue"));
var runner_1 = __importDefault(require("./runner"));
var configurer_1 = __importDefault(require("./configurer"));
var Petzl = /** @class */ (function () {
    function Petzl(configuration) {
        var _this = this;
        this.beforeEach = function (cb) {
            _this.queue.pushHookAction("beforeEach", cb);
        };
        this.afterEach = function (cb) {
            _this.queue.pushHookAction("afterEach", cb);
        };
        this.doOnce = function (cb) {
            _this.queue.pushAction({
                type: "doOnce",
                cb: function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, cb()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    });
                }); },
            });
        };
        this.configure = function (options) {
            _this.queue.pushAction({
                type: "configure",
                configuration: options,
            });
        };
        this.it = function (title, cb) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _this.queue.pushAction({
                type: "it",
                title: utils_1.formatTitle.apply(void 0, __spreadArrays([title], args)),
                cb: cb,
                args: args,
            });
        };
        this.describe = function (title, cb) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            _this.queue.pushAction({
                type: "describe-start",
                title: utils_1.formatTitle.apply(void 0, __spreadArrays([title], args)),
            });
            cb.apply(void 0, args);
            _this.queue.pushAction({
                type: "describe-end",
            });
        };
        utils_1.registerProcessEventListeners();
        var config = new configurer_1.default(configuration).config;
        this.config = config;
        this.queue = new queue_1.default(this.config);
        this.runner = new runner_1.default(this.queue, this.config);
    }
    return Petzl;
}());
exports.Petzl = Petzl;
var petzl = new Petzl();
var it = petzl.it, describe = petzl.describe, beforeEach = petzl.beforeEach, afterEach = petzl.afterEach, doOnce = petzl.doOnce, configure = petzl.configure, runner = petzl.runner;
exports.it = it;
exports.describe = describe;
exports.beforeEach = beforeEach;
exports.afterEach = afterEach;
exports.doOnce = doOnce;
exports.configure = configure;
exports.runner = runner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGV0emwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGV0emwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFxRTtBQUVyRSxrREFBNEI7QUFDNUIsb0RBQThCO0FBQzlCLDREQUFzQztBQUV0QztJQUtDLGVBQVksYUFBNkI7UUFBekMsaUJBTUM7UUFFTSxlQUFVLEdBQUcsVUFBQyxFQUFhO1lBQ2pDLEtBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUM7UUFFSyxjQUFTLEdBQUcsVUFBQyxFQUFhO1lBQ2hDLEtBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUM7UUFFSyxXQUFNLEdBQUcsVUFBQyxFQUFTO1lBQ3pCLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUNyQixJQUFJLEVBQUUsUUFBUTtnQkFDZCxFQUFFLEVBQUU7OztvQ0FDSSxxQkFBTSxFQUFFLEVBQUUsRUFBQTtvQ0FBakIsc0JBQU8sU0FBVSxFQUFDOzs7cUJBQ2xCO2FBQ0QsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUssY0FBUyxHQUFHLFVBQUMsT0FBdUM7WUFDMUQsS0FBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxXQUFXO2dCQUNqQixhQUFhLEVBQUUsT0FBTzthQUN0QixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7UUFFSyxPQUFFLEdBQUcsVUFDWCxLQUFlLEVBQ2YsRUFBYTtZQUNiLGNBQVU7aUJBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtnQkFBViw2QkFBVTs7WUFFVixLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztnQkFDckIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsS0FBSyxFQUFFLG1CQUFXLCtCQUFDLEtBQUssR0FBSyxJQUFJLEVBQUM7Z0JBQ2xDLEVBQUUsSUFBQTtnQkFDRixJQUFJLE1BQUE7YUFDSixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7UUFFSyxhQUFRLEdBQUcsVUFDakIsS0FBZSxFQUNmLEVBQXdCO1lBQ3hCLGNBQVU7aUJBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtnQkFBViw2QkFBVTs7WUFFVixLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztnQkFDckIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsS0FBSyxFQUFFLG1CQUFXLCtCQUFDLEtBQUssR0FBSyxJQUFJLEVBQUM7YUFDbEMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxlQUFJLElBQUksRUFBRTtZQUVaLEtBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO2dCQUNyQixJQUFJLEVBQUUsY0FBYzthQUNwQixDQUFDLENBQUM7UUFDSixDQUFDLENBQUM7UUEzREQscUNBQTZCLEVBQUUsQ0FBQTtRQUN2QixJQUFBLE1BQU0sR0FBSyxJQUFJLG9CQUFVLENBQUMsYUFBYSxDQUFDLE9BQWxDLENBQW1DO1FBQ2pELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUF1REYsWUFBQztBQUFELENBQUMsQUFsRUQsSUFrRUM7QUFzQkEsc0JBQUs7QUFwQk4sSUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUd6QixJQUFBLEVBQUUsR0FPQyxLQUFLLEdBUE4sRUFDRixRQUFRLEdBTUwsS0FBSyxTQU5BLEVBQ1IsVUFBVSxHQUtQLEtBQUssV0FMRSxFQUNWLFNBQVMsR0FJTixLQUFLLFVBSkMsRUFDVCxNQUFNLEdBR0gsS0FBSyxPQUhGLEVBQ04sU0FBUyxHQUVOLEtBQUssVUFGQyxFQUNULE1BQU0sR0FDSCxLQUFLLE9BREYsQ0FDRztBQUdULGdCQUFFO0FBQ0YsNEJBQVE7QUFDUixnQ0FBVTtBQUNWLDhCQUFTO0FBQ1Qsd0JBQU07QUFDTiw4QkFBUztBQUNULHdCQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0VGl0bGUsIHJlZ2lzdGVyUHJvY2Vzc0V2ZW50TGlzdGVuZXJzIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IEFueVZvaWRDQiwgQ29uZmlndXJhdGlvbiwgVGl0bGUsIFRlc3RDQiwgQW55Q0IgfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IFF1ZXVlIGZyb20gXCIuL3F1ZXVlXCI7XG5pbXBvcnQgUnVubmVyIGZyb20gXCIuL3J1bm5lclwiO1xuaW1wb3J0IENvbmZpZ3VyZXIgZnJvbSBcIi4vY29uZmlndXJlclwiO1xuXG5jbGFzcyBQZXR6bCB7XG5cdHByaXZhdGUgY29uZmlnOiBDb25maWd1cmF0aW9uO1xuXHRwcml2YXRlIHF1ZXVlOiBRdWV1ZTtcblx0cHVibGljIHJ1bm5lcjogUnVubmVyO1xuXG5cdGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb24/OiBDb25maWd1cmF0aW9uKSB7XG5cdFx0cmVnaXN0ZXJQcm9jZXNzRXZlbnRMaXN0ZW5lcnMoKVxuXHRcdGNvbnN0IHsgY29uZmlnIH0gPSBuZXcgQ29uZmlndXJlcihjb25maWd1cmF0aW9uKTtcblx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHR0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKHRoaXMuY29uZmlnKTtcblx0XHR0aGlzLnJ1bm5lciA9IG5ldyBSdW5uZXIodGhpcy5xdWV1ZSwgdGhpcy5jb25maWcpO1xuXHR9XG5cblx0cHVibGljIGJlZm9yZUVhY2ggPSAoY2I6IEFueVZvaWRDQikgPT4ge1xuXHRcdHRoaXMucXVldWUucHVzaEhvb2tBY3Rpb24oXCJiZWZvcmVFYWNoXCIsIGNiKTtcblx0fTtcblxuXHRwdWJsaWMgYWZ0ZXJFYWNoID0gKGNiOiBBbnlWb2lkQ0IpID0+IHtcblx0XHR0aGlzLnF1ZXVlLnB1c2hIb29rQWN0aW9uKFwiYWZ0ZXJFYWNoXCIsIGNiKTtcblx0fTtcblxuXHRwdWJsaWMgZG9PbmNlID0gKGNiOiBBbnlDQikgPT4ge1xuXHRcdHRoaXMucXVldWUucHVzaEFjdGlvbih7XG5cdFx0XHR0eXBlOiBcImRvT25jZVwiLFxuXHRcdFx0Y2I6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0cmV0dXJuIGF3YWl0IGNiKCk7XG5cdFx0XHR9LFxuXHRcdH0pO1xuXHR9O1xuXG5cdHB1YmxpYyBjb25maWd1cmUgPSAob3B0aW9uczogT21pdDxDb25maWd1cmF0aW9uLCBcImF1dG9SdW5cIj4pID0+IHtcblx0XHR0aGlzLnF1ZXVlLnB1c2hBY3Rpb24oe1xuXHRcdFx0dHlwZTogXCJjb25maWd1cmVcIixcblx0XHRcdGNvbmZpZ3VyYXRpb246IG9wdGlvbnMsXG5cdFx0fSk7XG5cdH07XG5cblx0cHVibGljIGl0ID0gPFQgZXh0ZW5kcyBhbnlbXT4oXG5cdFx0dGl0bGU6IFRpdGxlPFQ+LFxuXHRcdGNiOiBUZXN0Q0I8VD4sXG5cdFx0Li4uYXJnczogVFxuXHQpOiB2b2lkID0+IHtcblx0XHR0aGlzLnF1ZXVlLnB1c2hBY3Rpb24oe1xuXHRcdFx0dHlwZTogXCJpdFwiLFxuXHRcdFx0dGl0bGU6IGZvcm1hdFRpdGxlKHRpdGxlLCAuLi5hcmdzKSxcblx0XHRcdGNiLFxuXHRcdFx0YXJncyxcblx0XHR9KTtcblx0fTtcblxuXHRwdWJsaWMgZGVzY3JpYmUgPSA8VCBleHRlbmRzIGFueVtdPihcblx0XHR0aXRsZTogVGl0bGU8VD4sXG5cdFx0Y2I6ICguLi5hcmdzOiBUKSA9PiB2b2lkLFxuXHRcdC4uLmFyZ3M6IFRcblx0KTogdm9pZCA9PiB7XG5cdFx0dGhpcy5xdWV1ZS5wdXNoQWN0aW9uKHtcblx0XHRcdHR5cGU6IFwiZGVzY3JpYmUtc3RhcnRcIixcblx0XHRcdHRpdGxlOiBmb3JtYXRUaXRsZSh0aXRsZSwgLi4uYXJncyksXG5cdFx0fSk7XG5cblx0XHRjYiguLi5hcmdzKTtcblxuXHRcdHRoaXMucXVldWUucHVzaEFjdGlvbih7XG5cdFx0XHR0eXBlOiBcImRlc2NyaWJlLWVuZFwiLFxuXHRcdH0pO1xuXHR9O1xufVxuXG5jb25zdCBwZXR6bCA9IG5ldyBQZXR6bCgpO1xuXG5jb25zdCB7XG5cdGl0LFxuXHRkZXNjcmliZSxcblx0YmVmb3JlRWFjaCxcblx0YWZ0ZXJFYWNoLFxuXHRkb09uY2UsXG5cdGNvbmZpZ3VyZSxcblx0cnVubmVyLFxufSA9IHBldHpsO1xuXG5leHBvcnQge1xuXHRpdCxcblx0ZGVzY3JpYmUsXG5cdGJlZm9yZUVhY2gsXG5cdGFmdGVyRWFjaCxcblx0ZG9PbmNlLFxuXHRjb25maWd1cmUsXG5cdHJ1bm5lcixcblx0UGV0emwsXG59O1xuIl19