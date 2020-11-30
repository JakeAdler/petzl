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
        var colors = configuration.colors, volume = configuration.volume, dev = configuration.dev;
        if (dev) {
            this.logFn = dev.logger.log;
            this.format = dev.format;
            this.symbols = dev.symbols;
        }
        else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSxpQ0FBdUM7QUFFdkM7SUFPQyxnQkFBWSxhQUE0QjtRQUF4QyxpQkFlQztRQUVPLFlBQU8sR0FBRyxFQUFFLENBQUM7UUFFckIsZUFBVSxHQUFHO1lBQ1osS0FBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFDdEIsQ0FBQyxDQUFDO1FBRUYsb0JBQWUsR0FBRztZQUNqQixJQUFJLEtBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDOUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7YUFDbEI7aUJBQU07Z0JBQ04sS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDOUQ7UUFDRixDQUFDLENBQUM7UUFFRixpQkFBWSxHQUFHO1lBQ2QsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbkIsQ0FBQyxDQUFDO1FBRUYsUUFBRyxHQUFHO1lBQUMsY0FBYztpQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkLHlCQUFjOztZQUNwQixJQUFJLEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQixJQUNDLEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQztvQkFDaEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNO29CQUNuQixLQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssRUFDcEI7b0JBQ00sSUFBQSxTQUFTLEdBQWEsSUFBSSxHQUFqQixFQUFLLElBQUksR0FBSSxJQUFJLFNBQVIsQ0FBUztvQkFDbEMsS0FBSSxDQUFDLEtBQUssT0FBVixLQUFJLGtCQUFPLEtBQUcsS0FBSSxDQUFDLE9BQU8sR0FBRyxTQUFXLEdBQUssSUFBSSxHQUFFO2lCQUNuRDtxQkFBTTtvQkFDTixLQUFJLENBQUMsS0FBSyxPQUFWLEtBQUksRUFBVSxJQUFJLEVBQUU7aUJBQ3BCO2FBQ0Q7UUFDRixDQUFDLENBQUM7UUFFRixTQUFJLEdBQUcsVUFBQyxLQUFhLEVBQUUsT0FBZTtZQUNyQyxJQUFJLEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQixLQUFJLENBQUMsR0FBRyxDQUNQLEtBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUM3QixLQUFLLEVBQ0wsS0FBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBSSxPQUFPLFFBQUssQ0FBQyxDQUNuQyxDQUFDO2FBQ0Y7UUFDRixDQUFDLENBQUM7UUFFRixTQUFJLEdBQUcsVUFBQyxLQUFhLEVBQUUsT0FBZTtZQUNyQyxJQUFJLEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQixLQUFJLENBQUMsR0FBRyxDQUNQLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUMzQixLQUFLLEVBQ0wsS0FBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBSSxPQUFPLFFBQUssQ0FBQyxDQUNqQyxDQUFDO2FBQ0Y7UUFDRixDQUFDLENBQUM7UUFFRixrQkFBYSxHQUFHLFVBQUMsS0FBYTtZQUM3QixJQUFJLEtBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQixLQUFJLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6RDtZQUNELEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUNuQixDQUFDLENBQUM7UUExRU8sSUFBQSxNQUFNLEdBQWtCLGFBQWEsT0FBL0IsRUFBRSxNQUFNLEdBQVUsYUFBYSxPQUF2QixFQUFFLEdBQUcsR0FBSyxhQUFhLElBQWxCLENBQW1CO1FBRTlDLElBQUksR0FBRyxFQUFFO1lBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDO1NBQzNCO2FBQU07WUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQTZERixhQUFDO0FBQUQsQ0FBQyxBQW5GRCxJQW1GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ0ZuLCBDb2xvcnMsIENvbmZpZ3VyYXRpb24gfSBmcm9tIFwiLi90eXBlc1wiO1xuaW1wb3J0IHsgY3JlYXRlQ29sb3JzIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9nZ2VyIHtcblx0bG9nRm46IExvZ0ZuO1xuXHRjb2xvcnM6IENvbG9ycztcblx0Zm9ybWF0OiBib29sZWFuO1xuXHRzeW1ib2xzOiBib29sZWFuO1xuXHR2b2x1bWU6IG51bWJlcjtcblxuXHRjb25zdHJ1Y3Rvcihjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uKSB7XG5cdFx0Y29uc3QgeyBjb2xvcnMsIHZvbHVtZSwgZGV2IH0gPSBjb25maWd1cmF0aW9uO1xuXG5cdFx0aWYgKGRldikge1xuXHRcdFx0dGhpcy5sb2dGbiA9IGRldi5sb2dnZXIubG9nO1xuXHRcdFx0dGhpcy5mb3JtYXQgPSBkZXYuZm9ybWF0O1xuXHRcdFx0dGhpcy5zeW1ib2xzID0gZGV2LnN5bWJvbHM7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMubG9nRm4gPSBjb25zb2xlLmxvZztcblx0XHRcdHRoaXMuZm9ybWF0ID0gdHJ1ZTtcblx0XHRcdHRoaXMuc3ltYm9scyA9IHRydWU7XG5cdFx0fVxuXG5cdFx0dGhpcy52b2x1bWUgPSB2b2x1bWU7XG5cdFx0dGhpcy5jb2xvcnMgPSBjcmVhdGVDb2xvcnMoY29sb3JzKTtcblx0fVxuXG5cdHByaXZhdGUgcGFkZGluZyA9IFwiXCI7XG5cblx0YWRkUGFkZGluZyA9ICgpID0+IHtcblx0XHR0aGlzLnBhZGRpbmcgKz0gXCIgIFwiO1xuXHR9O1xuXG5cdHN1YnRyYWN0UGFkZGluZyA9ICgpID0+IHtcblx0XHRpZiAodGhpcy5wYWRkaW5nLmxlbmd0aCA9PT0gMikge1xuXHRcdFx0dGhpcy5wYWRkaW5nID0gXCJcIjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5wYWRkaW5nID0gdGhpcy5wYWRkaW5nLnNsaWNlKDAsIHRoaXMucGFkZGluZy5sZW5ndGggLSAyKTtcblx0XHR9XG5cdH07XG5cblx0Zmx1c2hQYWRkaW5nID0gKCkgPT4ge1xuXHRcdHRoaXMucGFkZGluZyA9IFwiXCI7XG5cdH07XG5cblx0bG9nID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG5cdFx0aWYgKHRoaXMudm9sdW1lID49IDIpIHtcblx0XHRcdGlmIChcblx0XHRcdFx0dGhpcy52b2x1bWUgPj0gMyAmJlxuXHRcdFx0XHR0aGlzLnBhZGRpbmcubGVuZ3RoICYmXG5cdFx0XHRcdHRoaXMuZm9ybWF0ICE9PSBmYWxzZVxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IFtwYWRkZWRBcmcsIC4uLnJlc3RdID0gYXJncztcblx0XHRcdFx0dGhpcy5sb2dGbihgJHt0aGlzLnBhZGRpbmd9JHtwYWRkZWRBcmd9YCwgLi4ucmVzdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLmxvZ0ZuKC4uLmFyZ3MpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHRwYXNzID0gKHRpdGxlOiBzdHJpbmcsIHJ1bnRpbWU6IG51bWJlcikgPT4ge1xuXHRcdGlmICh0aGlzLnZvbHVtZSA+PSAzKSB7XG5cdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0dGhpcy5jb2xvcnMuZ3JlZW4oXCJQQVNTRUQ6IFwiKSxcblx0XHRcdFx0dGl0bGUsXG5cdFx0XHRcdHRoaXMuY29sb3JzLmdyZWVuKGAoJHtydW50aW1lfW1zKWApXG5cdFx0XHQpO1xuXHRcdH1cblx0fTtcblxuXHRmYWlsID0gKHRpdGxlOiBzdHJpbmcsIHJ1bnRpbWU6IG51bWJlcikgPT4ge1xuXHRcdGlmICh0aGlzLnZvbHVtZSA+PSAzKSB7XG5cdFx0XHR0aGlzLmxvZyhcblx0XHRcdFx0dGhpcy5jb2xvcnMucmVkKFwiRkFJTEVEOiBcIiksXG5cdFx0XHRcdHRpdGxlLFxuXHRcdFx0XHR0aGlzLmNvbG9ycy5yZWQoYCgke3J1bnRpbWV9bXMpYClcblx0XHRcdCk7XG5cdFx0fVxuXHR9O1xuXG5cdGxvZ0dyb3VwVGl0bGUgPSAodGl0bGU6IHN0cmluZykgPT4ge1xuXHRcdGlmICh0aGlzLnZvbHVtZSA+PSAzKSB7XG5cdFx0XHR0aGlzLmxvZyh0aGlzLmNvbG9ycy5ib2xkKHRoaXMuY29sb3JzLnVuZGVybGluZSh0aXRsZSkpKTtcblx0XHR9XG5cdFx0dGhpcy5hZGRQYWRkaW5nKCk7XG5cdH07XG59XG4iXX0=