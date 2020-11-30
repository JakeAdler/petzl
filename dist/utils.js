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
            magenta: function (args) { return args; },
            grey: function (args) { return args; },
        };
    }
    else {
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
    }
};
exports.createColors = createColors;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBSWxDLElBQU0sV0FBVyxHQUFHLFVBQzFCLEtBQWU7SUFDZixjQUFVO1NBQVYsVUFBVSxFQUFWLHFCQUFVLEVBQVYsSUFBVTtRQUFWLDZCQUFVOztJQUVWLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFO1FBQ2hDLEtBQUssR0FBRyxLQUFLLGVBQUksSUFBSSxDQUFDLENBQUM7S0FDdkI7SUFDRCxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFSVyxRQUFBLFdBQVcsZUFRdEI7QUFFRjtJQUNDO1FBQUEsaUJBRUM7UUFFTyxjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUViLFVBQUssR0FBRztZQUNkLEtBQUksQ0FBQyxTQUFTLEdBQUcsd0JBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNwQyxDQUFDLENBQUM7UUFFSyxTQUFJLEdBQUc7WUFDYixLQUFJLENBQUMsT0FBTyxHQUFHLHdCQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDakMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUM7UUFiRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBYUYsWUFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFoQlksc0JBQUs7QUFrQlgsSUFBTSw2QkFBNkIsR0FBRztJQUM1QyxJQUFNLE1BQU0sR0FBRyxvQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWxDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxHQUFHO1FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFXLEdBQUcsQ0FBQyxJQUFJLFVBQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRSxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQU5XLFFBQUEsNkJBQTZCLGlDQU14QztBQUVLLElBQU0sWUFBWSxHQUFHLFVBQUMsSUFBYTtJQUN6QyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ1YsT0FBTztZQUNOLFNBQVMsRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3pCLElBQUksRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3BCLEdBQUcsRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ25CLElBQUksRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3BCLEtBQUssRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3JCLE9BQU8sRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1lBQ3ZCLElBQUksRUFBRSxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksRUFBSixDQUFJO1NBQ3BCLENBQUM7S0FDRjtTQUFNO1FBQ04sSUFBTSxPQUFLLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLE9BQU87WUFDTixTQUFTLEVBQUU7Z0JBQUMsY0FBTztxQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO29CQUFQLHlCQUFPOztnQkFBSyxPQUFBLGNBQVUsSUFBSSxHQUFHLE9BQU87WUFBeEIsQ0FBd0I7WUFDaEQsSUFBSSxFQUFFO2dCQUFDLGNBQU87cUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztvQkFBUCx5QkFBTzs7Z0JBQUssT0FBQSxjQUFVLElBQUksR0FBRyxPQUFPO1lBQXhCLENBQXdCO1lBQzNDLEdBQUcsRUFBRTtnQkFBQyxjQUFPO3FCQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87b0JBQVAseUJBQU87O2dCQUFLLE9BQUEsZUFBVyxJQUFJLEdBQUcsT0FBTztZQUF6QixDQUF5QjtZQUMzQyxJQUFJLEVBQUU7Z0JBQUMsY0FBTztxQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO29CQUFQLHlCQUFPOztnQkFBSyxPQUFBLGVBQVcsSUFBSSxHQUFHLE9BQU87WUFBekIsQ0FBeUI7WUFDNUMsS0FBSyxFQUFFO2dCQUFDLGNBQU87cUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztvQkFBUCx5QkFBTzs7Z0JBQUssT0FBQSxlQUFXLElBQUksR0FBRyxPQUFPO1lBQXpCLENBQXlCO1lBQzdDLE9BQU8sRUFBRTtnQkFBQyxjQUFPO3FCQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87b0JBQVAseUJBQU87O2dCQUFLLE9BQUEsZUFBVyxJQUFJLEdBQUcsT0FBTztZQUF6QixDQUF5QjtZQUMvQyxJQUFJLEVBQUU7Z0JBQUMsY0FBTztxQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO29CQUFQLHlCQUFPOztnQkFBSyxPQUFBLGVBQVcsSUFBSSxHQUFHLE9BQU87WUFBekIsQ0FBeUI7U0FDNUMsQ0FBQztLQUNGO0FBQ0YsQ0FBQyxDQUFDO0FBdkJXLFFBQUEsWUFBWSxnQkF1QnZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGVyZm9ybWFuY2UgfSBmcm9tIFwicGVyZl9ob29rc1wiO1xuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcbmltcG9ydCB7IENvbG9ycywgVGl0bGUgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5leHBvcnQgY29uc3QgZm9ybWF0VGl0bGUgPSA8VCBleHRlbmRzIGFueVtdPihcblx0dGl0bGU6IFRpdGxlPFQ+LFxuXHQuLi5hcmdzOiBUXG4pOiBzdHJpbmcgPT4ge1xuXHRpZiAodHlwZW9mIHRpdGxlID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHR0aXRsZSA9IHRpdGxlKC4uLmFyZ3MpO1xuXHR9XG5cdHJldHVybiB0aXRsZS50cmltKCk7XG59O1xuXG5leHBvcnQgY2xhc3MgQ2xvY2sge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnN0YXJ0KCk7XG5cdH1cblxuXHRwcml2YXRlIHN0YXJ0VGltZSA9IDA7XG5cdHByaXZhdGUgZW5kVGltZSA9IDA7XG5cblx0cHVibGljIHN0YXJ0ID0gKCkgPT4ge1xuXHRcdHRoaXMuc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cdH07XG5cblx0cHVibGljIGNhbGMgPSAoKTogbnVtYmVyID0+IHtcblx0XHR0aGlzLmVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRyZXR1cm4gTWF0aC5yb3VuZChNYXRoLmFicyh0aGlzLmVuZFRpbWUgLSB0aGlzLnN0YXJ0VGltZSkpO1xuXHR9O1xufVxuXG5leHBvcnQgY29uc3QgcmVnaXN0ZXJQcm9jZXNzRXZlbnRMaXN0ZW5lcnMgPSAoKSA9PiB7XG5cdGNvbnN0IGNvbG9ycyA9IGNyZWF0ZUNvbG9ycyh0cnVlKTtcblxuXHRwcm9jZXNzLm9uKFwidW5jYXVnaHRFeGNlcHRpb25cIiwgKGVycikgPT4ge1xuXHRcdGNvbnNvbGUubG9nKGNvbG9ycy5yZWQoYEZhaWxlZCAoJHtlcnIubmFtZX0pOiBcXG5gKSwgZXJyLm1lc3NhZ2UpO1xuXHR9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVDb2xvcnMgPSAocmVhbDogYm9vbGVhbik6IENvbG9ycyA9PiB7XG5cdGlmICghcmVhbCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR1bmRlcmxpbmU6IChhcmdzKSA9PiBhcmdzLFxuXHRcdFx0Ym9sZDogKGFyZ3MpID0+IGFyZ3MsXG5cdFx0XHRyZWQ6IChhcmdzKSA9PiBhcmdzLFxuXHRcdFx0Ymx1ZTogKGFyZ3MpID0+IGFyZ3MsXG5cdFx0XHRncmVlbjogKGFyZ3MpID0+IGFyZ3MsXG5cdFx0XHRtYWdlbnRhOiAoYXJncykgPT4gYXJncyxcblx0XHRcdGdyZXk6IChhcmdzKSA9PiBhcmdzLFxuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0Y29uc3QgcmVzZXQgPSBcIlxceDFiWzBtXCI7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHVuZGVybGluZTogKC4uLmFyZ3MpID0+IGBcXHgxYls0bSR7YXJnc30ke3Jlc2V0fWAsXG5cdFx0XHRib2xkOiAoLi4uYXJncykgPT4gYFxceDFiWzFtJHthcmdzfSR7cmVzZXR9YCxcblx0XHRcdHJlZDogKC4uLmFyZ3MpID0+IGBcXHgxYlszMW0ke2FyZ3N9JHtyZXNldH1gLFxuXHRcdFx0Ymx1ZTogKC4uLmFyZ3MpID0+IGBcXHgxYlszNG0ke2FyZ3N9JHtyZXNldH1gLFxuXHRcdFx0Z3JlZW46ICguLi5hcmdzKSA9PiBgXFx4MWJbMzJtJHthcmdzfSR7cmVzZXR9YCxcblx0XHRcdG1hZ2VudGE6ICguLi5hcmdzKSA9PiBgXFx4MWJbMzVtJHthcmdzfSR7cmVzZXR9YCxcblx0XHRcdGdyZXk6ICguLi5hcmdzKSA9PiBgXFx4MWJbOTBtJHthcmdzfSR7cmVzZXR9YCxcblx0XHR9O1xuXHR9XG59O1xuIl19