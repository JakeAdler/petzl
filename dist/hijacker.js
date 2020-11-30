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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlqYWNrZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaGlqYWNrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQTtJQVNDLGtCQUFZLE1BQWM7UUFBMUIsaUJBUUM7UUFFTSxpQkFBWSxHQUFHLEVBQUUsQ0FBQztRQUVsQixzQkFBaUIsR0FBRztZQUMxQixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRzs7Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFDbkMsQ0FBQSxLQUFBLEtBQUksQ0FBQyxZQUFZLENBQUEsQ0FBQyxJQUFJLFdBQUksSUFBSSxFQUFFO1lBQ2pDLENBQUMsQ0FBQztRQUNILENBQUMsQ0FBQztRQUVGLGlDQUFpQztRQUMxQixtQkFBYyxHQUFHLFVBQUMsUUFBcUIsRUFBRSxRQUFnQjtZQUMvRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsR0FBRyxDQUFDO1lBQzlCLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ2pELEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUksUUFBUSxVQUFLLFFBQVEsT0FBSSxDQUFDLENBQUMsQ0FBQztnQkFDekQsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNsQixLQUFzQixVQUFpQixFQUFqQixLQUFBLEtBQUksQ0FBQyxZQUFZLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCLEVBQUU7b0JBQXBDLElBQU0sT0FBTyxTQUFBO29CQUNqQixJQUFJLEtBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO3dCQUMzQixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztxQkFDeEI7eUJBQU07d0JBQ04sS0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDbEI7aUJBQ0Q7Z0JBQ0QsS0FBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ3ZCO1lBQ0QsS0FBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBRUYsZ0NBQWdDO1FBQ3pCLG1CQUFjLEdBQUcsVUFBQyxLQUFhLEVBQUUsSUFBYTtZQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxLQUFJLENBQUMsR0FBRyxDQUFDO1lBQzlCLElBQUksS0FBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7b0JBQzdCLElBQUksS0FBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ3RCLEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDckQ7b0JBQ0QsS0FBc0IsVUFBaUIsRUFBakIsS0FBQSxLQUFJLENBQUMsWUFBWSxFQUFqQixjQUFpQixFQUFqQixJQUFpQixFQUFFO3dCQUFwQyxJQUFNLE9BQU8sU0FBQTt3QkFDakIsSUFBSSxLQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTs0QkFDM0IsS0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7eUJBQ3hCOzZCQUFNOzRCQUNOLEtBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ2xCO3FCQUNEO2lCQUNEO2FBQ0Q7WUFDRCxLQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUM7UUFFSyxtQkFBYyxHQUFHO1lBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUM7WUFDaEMsS0FBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBMURELElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDcEMsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO1FBQzlDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUMvQixDQUFDO0lBb0RGLGVBQUM7QUFBRCxDQUFDLEFBckVELElBcUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcbmltcG9ydCB7IENvbG9ycywgSG9va3MsIExvZ0ZuIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGlqYWNrZXIge1xuXHRzeW1ib2xzOiBib29sZWFuO1xuXHRsb2dGbjogTG9nRm47XG5cdGxvZzogTG9nRm47XG5cdGNvbG9yczogQ29sb3JzO1xuXHR2b2x1bWU6IG51bWJlcjtcblx0YWRkUGFkZGluZzogKCkgPT4gdm9pZDtcblx0c3VidHJhY3RQYWRkaW5nOiAoKSA9PiB2b2lkO1xuXG5cdGNvbnN0cnVjdG9yKGxvZ2dlcjogTG9nZ2VyKSB7XG5cdFx0dGhpcy5sb2cgPSBsb2dnZXIubG9nO1xuXHRcdHRoaXMubG9nRm4gPSBsb2dnZXIubG9nRm47XG5cdFx0dGhpcy5jb2xvcnMgPSBsb2dnZXIuY29sb3JzO1xuXHRcdHRoaXMudm9sdW1lID0gbG9nZ2VyLnZvbHVtZTtcblx0XHR0aGlzLmFkZFBhZGRpbmcgPSBsb2dnZXIuYWRkUGFkZGluZztcblx0XHR0aGlzLnN1YnRyYWN0UGFkZGluZyA9IGxvZ2dlci5zdWJ0cmFjdFBhZGRpbmc7XG5cdFx0dGhpcy5zeW1ib2xzID0gbG9nZ2VyLnN5bWJvbHM7XG5cdH1cblxuXHRwdWJsaWMgY2FwdHVyZWRMb2dzID0gW107XG5cblx0cHVibGljIGhpamFja0NvbnNvbGVMb2dzID0gKCkgPT4ge1xuXHRcdGdsb2JhbC5jb25zb2xlLmxvZyA9ICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuXHRcdFx0dGhpcy5jYXB0dXJlZExvZ3MucHVzaCguLi5hcmdzKTtcblx0XHR9O1xuXHR9O1xuXG5cdC8vIFJlbGVhc2UgbG9ncyBjYXB0dXJlZCBieSBob29rc1xuXHRwdWJsaWMgcmVsZWFzZUhvb2tMb2cgPSAoaG9va05hbWU6IGtleW9mIEhvb2tzLCB0ZXN0TmFtZTogc3RyaW5nKSA9PiB7XG5cdFx0Z2xvYmFsLmNvbnNvbGUubG9nID0gdGhpcy5sb2c7XG5cdFx0aWYgKHRoaXMuY2FwdHVyZWRMb2dzLmxlbmd0aCAmJiB0aGlzLnZvbHVtZSA+PSAyKSB7XG5cdFx0XHR0aGlzLmxvZyh0aGlzLmNvbG9ycy5ibHVlKGAke2hvb2tOYW1lfSAoJHt0ZXN0TmFtZX0pOmApKTtcblx0XHRcdHRoaXMuYWRkUGFkZGluZygpO1xuXHRcdFx0Zm9yIChjb25zdCBtZXNzYWdlIG9mIHRoaXMuY2FwdHVyZWRMb2dzKSB7XG5cdFx0XHRcdGlmICh0aGlzLnN5bWJvbHMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0dGhpcy5sb2coXCItIFwiLCBtZXNzYWdlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLmxvZyhtZXNzYWdlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0dGhpcy5zdWJ0cmFjdFBhZGRpbmcoKTtcblx0XHR9XG5cdFx0dGhpcy5jYXB0dXJlZExvZ3MgPSBbXTtcblx0fTtcblxuXHQvLyBSZWxlYXNlIGxvZ3MgY2FwdHVyZWQgYnkgdGVzdFxuXHRwdWJsaWMgcmVsZWFzZVRlc3RMb2cgPSAodGl0bGU6IHN0cmluZywgcGFzczogYm9vbGVhbikgPT4ge1xuXHRcdGdsb2JhbC5jb25zb2xlLmxvZyA9IHRoaXMubG9nO1xuXHRcdGlmICh0aGlzLnZvbHVtZSA+PSAyKSB7XG5cdFx0XHRpZiAodGhpcy5jYXB0dXJlZExvZ3MubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICh0aGlzLnZvbHVtZSA9PT0gMikge1xuXHRcdFx0XHRcdHRoaXMubG9nKHRoaXMuY29sb3JzW3Bhc3MgPyBcImdyZWVuXCIgOiBcInJlZFwiXSh0aXRsZSkpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGZvciAoY29uc3QgbWVzc2FnZSBvZiB0aGlzLmNhcHR1cmVkTG9ncykge1xuXHRcdFx0XHRcdGlmICh0aGlzLnN5bWJvbHMgIT09IGZhbHNlKSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvZyhcIiogXCIsIG1lc3NhZ2UpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHR0aGlzLmxvZyhtZXNzYWdlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5jYXB0dXJlZExvZ3MgPSBbXTtcblx0fTtcblxuXHRwdWJsaWMgcmVzZXRHbG9iYWxMb2cgPSAoKSA9PiB7XG5cdFx0Z2xvYmFsLmNvbnNvbGUubG9nID0gdGhpcy5sb2dGbjtcblx0XHR0aGlzLmNhcHR1cmVkTG9ncyA9IFtdO1xuXHR9O1xufVxuIl19