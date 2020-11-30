"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Configurer = /** @class */ (function () {
    function Configurer(options) {
        var _this = this;
        this.defaultConfiguration = {
            runner: {
                use: "entryPoint",
            },
            volume: 3,
            bubbleHooks: false,
            colors: true,
            dev: false,
        };
        this.mergeConfigWithDefault = function (options) {
            if (options) {
                _this.validateConfig(options);
                _this.config = Object.assign({}, _this.defaultConfiguration, options);
            }
            else {
                _this.config = Object.assign({}, _this.defaultConfiguration);
            }
        };
        this.findConfig = function () {
            var pathToConfig = path_1.default.join(process.cwd(), "petzl.config.js");
            var configExists = fs_1.default.existsSync(pathToConfig);
            if (configExists) {
                var userConfigFile = require(pathToConfig);
                _this.mergeConfigWithDefault(userConfigFile);
            }
            else {
                _this.mergeConfigWithDefault();
            }
        };
        this.validateConfig = function (config) {
            if (!config)
                return;
            if (config.dev && config.dev !== false) {
                if (config.dev === true) {
                    throw new types_1.ConfigError("dev", "dev can either be set to 'false' or DevConfiguration");
                }
                //TODO: VALIDATE DEV OPTIONS
            }
            var runnerConfig = config.runner;
            if (types_1.isMatchExtensionsConfig(runnerConfig)) {
                // validate matchExtensions config
                if (runnerConfig.root) {
                    var rootExists = fs_1.default.existsSync(runnerConfig.root);
                    if (!rootExists) {
                        throw new types_1.ConfigError("runner.root", "directory " + runnerConfig.root + " does not exist");
                    }
                }
                else {
                    throw new types_1.ConfigError("runner.root", "is required to use the 'matchExtensions' runner");
                }
                if (!runnerConfig.match) {
                    throw new types_1.ConfigError("runner.match", "is required to use the 'matchGlobs' runner");
                }
                else {
                    if (!Array.isArray(runnerConfig.match)) {
                        throw new types_1.ConfigError("runner.root", "must be an Array");
                    }
                    else {
                        for (var _i = 0, _a = runnerConfig.match; _i < _a.length; _i++) {
                            var matcher = _a[_i];
                            if (matcher.charAt(0) !== ".") {
                                throw new types_1.ConfigError("runner.match", ": Matcher should begin with '.', but got '" + matcher + "'");
                            }
                        }
                    }
                }
            }
            else if (types_1.isEntryPointConfig(runnerConfig)) {
                // validate
            }
            else if (types_1.isSequencerConfig(runnerConfig)) {
                // validate sequencer config
                if (!runnerConfig.include) {
                    throw new types_1.ConfigError("runner.include", "is required to use the 'sequencer' runner");
                }
                else {
                    if (!Array.isArray(runnerConfig.include)) {
                        throw new types_1.ConfigError("runner.include", "is required to be an Array");
                    }
                    else {
                        runnerConfig.include.forEach(function (fileOrDir) {
                            var exists = fs_1.default.existsSync(fileOrDir);
                            if (!exists) {
                                throw new types_1.ConfigError("runner.include", "path in sequence does not exist -> \"" + fileOrDir + "\"");
                            }
                        });
                    }
                }
            }
        };
        if (options) {
            this.mergeConfigWithDefault(options);
        }
        else {
            this.findConfig();
        }
    }
    return Configurer;
}());
exports.default = Configurer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlndXJlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWd1cmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUNBTWlCO0FBQ2pCLDBDQUFvQjtBQUNwQiw4Q0FBd0I7QUFFeEI7SUFHQyxvQkFBWSxPQUF1QjtRQUFuQyxpQkFNQztRQUNPLHlCQUFvQixHQUFrQjtZQUM3QyxNQUFNLEVBQUU7Z0JBQ1AsR0FBRyxFQUFFLFlBQVk7YUFDakI7WUFDRCxNQUFNLEVBQUUsQ0FBQztZQUNULFdBQVcsRUFBRSxLQUFLO1lBQ2xCLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUFFLEtBQUs7U0FDVixDQUFDO1FBRU0sMkJBQXNCLEdBQUcsVUFBQyxPQUF1QjtZQUN4RCxJQUFJLE9BQU8sRUFBRTtnQkFDWixLQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QixLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNwRTtpQkFBTTtnQkFDTixLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO2FBQzNEO1FBQ0YsQ0FBQyxDQUFDO1FBRU0sZUFBVSxHQUFHO1lBQ3BCLElBQU0sWUFBWSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUM7WUFDakUsSUFBTSxZQUFZLEdBQUcsWUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNqRCxJQUFJLFlBQVksRUFBRTtnQkFDakIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUM3QyxLQUFJLENBQUMsc0JBQXNCLENBQUMsY0FBYyxDQUFD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O1lBQ1osSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDTixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbEI7SUFDRixDQUFDO0lBOEdGLGlCQUFDO0FBQUQsQ0FBQyxBQXZIRCxJQXVIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdENvbmZpZ0Vycm9yLFxuXHRDb25maWd1cmF0aW9uLFxuXHRpc0VudHJ5UG9pbnRDb25maWcsXG5cdGlzTWF0Y2hFeHRlbnNpb25zQ29uZmlnLFxuXHRpc1NlcXVlbmNlckNvbmZpZyxcbn0gZnJvbSBcIi4vdHlwZXNcIjtcbmltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbmZpZ3VyZXIge1xuXHRwdWJsaWMgY29uZmlnOiBDb25maWd1cmF0aW9uO1xuXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBDb25maWd1cmF0aW9uKSB7XG5cdFx0aWYgKG9wdGlvbnMpIHtcblx0XHRcdHRoaXMubWVyZ2VDb25maWdXaXRoRGVmYXVsdChvcHRpb25zKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5maW5kQ29uZmlnKCk7XG5cdFx0fVxuXHR9XG5cdHByaXZhdGUgZGVmYXVsdENvbmZpZ3VyYXRpb246IENvbmZpZ3VyYXRpb24gPSB7XG5cdFx0cnVubmVyOiB7XG5cdFx0XHR1c2U6IFwiZW50cnlQb2ludFwiLFxuXHRcdH0sXG5cdFx0dm9sdW1lOiAzLFxuXHRcdGJ1YmJsZUhvb2tzOiBmYWxzZSxcblx0XHRjb2xvcnM6IHRydWUsXG5cdFx0ZGV2OiBmYWxzZSxcblx0fTtcblxuXHRwcml2YXRlIG1lcmdlQ29uZmlnV2l0aERlZmF1bHQgPSAob3B0aW9ucz86IENvbmZpZ3VyYXRpb24pID0+IHtcblx0XHRpZiAob3B0aW9ucykge1xuXHRcdFx0dGhpcy52YWxpZGF0ZUNvbmZpZyhvcHRpb25zKTtcblx0XHRcdHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0Q29uZmlndXJhdGlvbiwgb3B0aW9ucyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0Q29uZmlndXJhdGlvbik7XG5cdFx0fVxuXHR9O1xuXG5cdHByaXZhdGUgZmluZENvbmZpZyA9ICgpID0+IHtcblx0XHRjb25zdCBwYXRoVG9Db25maWcgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJwZXR6bC5jb25maWcuanNcIik7XG5cdFx0Y29uc3QgY29uZmlnRXhpc3RzID0gZnMuZXhpc3RzU3luYyhwYXRoVG9Db25maWcpO1xuXHRcdGlmIChjb25maWdFeGlzdHMpIHtcblx0XHRcdGNvbnN0IHVzZXJDb25maWdGaWxlID0gcmVxdWlyZShwYXRoVG9Db25maWcpO1xuXHRcdFx0dGhpcy5tZXJnZUNvbmZpZ1dpdGhEZWZhdWx0KHVzZXJDb25maWdGaWxlKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5tZXJnZUNvbmZpZ1dpdGhEZWZhdWx0KCk7XG5cdFx0fVxuXHR9O1xuXG5cdHByaXZhdGUgdmFsaWRhdGVDb25maWcgPSAoY29uZmlnOiBQYXJ0aWFsPENvbmZpZ3VyYXRpb24+KSA9PiB7XG5cdFx0aWYgKCFjb25maWcpIHJldHVybjtcblx0XHRpZiAoY29uZmlnLmRldiAmJiBjb25maWcuZGV2ICE9PSBmYWxzZSkge1xuXHRcdFx0aWYgKGNvbmZpZy5kZXYgPT09IHRydWUpIHtcblx0XHRcdFx0dGhyb3cgbmV3IENvbmZpZ0Vycm9yKFxuXHRcdFx0XHRcdFwiZGV2XCIsXG5cdFx0XHRcdFx0XCJkZXYgY2FuIGVpdGhlciBiZSBzZXQgdG8gJ2ZhbHNlJyBvciBEZXZDb25maWd1cmF0aW9uXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdC8vVE9ETzogVkFMSURBVEUgREVWIE9QVElPTlNcblx0XHR9XG5cblx0XHRjb25zdCBydW5uZXJDb25maWcgPSBjb25maWcucnVubmVyO1xuXG5cdFx0aWYgKGlzTWF0Y2hFeHRlbnNpb25zQ29uZmlnKHJ1bm5lckNvbmZpZykpIHtcblx0XHRcdC8vIHZhbGlkYXRlIG1hdGNoRXh0ZW5zaW9ucyBjb25maWdcblx0XHRcdGlmIChydW5uZXJDb25maWcucm9vdCkge1xuXHRcdFx0XHRjb25zdCByb290RXhpc3RzID0gZnMuZXhpc3RzU3luYyhydW5uZXJDb25maWcucm9vdCk7XG5cdFx0XHRcdGlmICghcm9vdEV4aXN0cykge1xuXHRcdFx0XHRcdHRocm93IG5ldyBDb25maWdFcnJvcihcblx0XHRcdFx0XHRcdFwicnVubmVyLnJvb3RcIixcblx0XHRcdFx0XHRcdGBkaXJlY3RvcnkgJHtydW5uZXJDb25maWcucm9vdH0gZG9lcyBub3QgZXhpc3RgXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IENvbmZpZ0Vycm9yKFxuXHRcdFx0XHRcdFwicnVubmVyLnJvb3RcIixcblx0XHRcdFx0XHRcImlzIHJlcXVpcmVkIHRvIHVzZSB0aGUgJ21hdGNoRXh0ZW5zaW9ucycgcnVubmVyXCJcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdGlmICghcnVubmVyQ29uZmlnLm1hdGNoKSB7XG5cdFx0XHRcdHRocm93IG5ldyBDb25maWdFcnJvcihcblx0XHRcdFx0XHRcInJ1bm5lci5tYXRjaFwiLFxuXHRcdFx0XHRcdFwiaXMgcmVxdWlyZWQgdG8gdXNlIHRoZSAnbWF0Y2hHbG9icycgcnVubmVyXCJcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICghQXJyYXkuaXNBcnJheShydW5uZXJDb25maWcubWF0Y2gpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IENvbmZpZ0Vycm9yKFwicnVubmVyLnJvb3RcIiwgXCJtdXN0IGJlIGFuIEFycmF5XCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGZvciAoY29uc3QgbWF0Y2hlciBvZiBydW5uZXJDb25maWcubWF0Y2gpIHtcblx0XHRcdFx0XHRcdGlmIChtYXRjaGVyLmNoYXJBdCgwKSAhPT0gXCIuXCIpIHtcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IENvbmZpZ0Vycm9yKFxuXHRcdFx0XHRcdFx0XHRcdFwicnVubmVyLm1hdGNoXCIsXG5cdFx0XHRcdFx0XHRcdFx0YDogTWF0Y2hlciBzaG91bGQgYmVnaW4gd2l0aCAnLicsIGJ1dCBnb3QgJyR7bWF0Y2hlcn0nYFxuXHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaXNFbnRyeVBvaW50Q29uZmlnKHJ1bm5lckNvbmZpZykpIHtcblx0XHRcdC8vIHZhbGlkYXRlXG5cdFx0fSBlbHNlIGlmIChpc1NlcXVlbmNlckNvbmZpZyhydW5uZXJDb25maWcpKSB7XG5cdFx0XHQvLyB2YWxpZGF0ZSBzZXF1ZW5jZXIgY29uZmlnXG5cdFx0XHRpZiAoIXJ1bm5lckNvbmZpZy5pbmNsdWRlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBDb25maWdFcnJvcihcblx0XHRcdFx0XHRcInJ1bm5lci5pbmNsdWRlXCIsXG5cdFx0XHRcdFx0XCJpcyByZXF1aXJlZCB0byB1c2UgdGhlICdzZXF1ZW5jZXInIHJ1bm5lclwiXG5cdFx0XHRcdCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkocnVubmVyQ29uZmlnLmluY2x1ZGUpKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IENvbmZpZ0Vycm9yKFxuXHRcdFx0XHRcdFx0XCJydW5uZXIuaW5jbHVkZVwiLFxuXHRcdFx0XHRcdFx0XCJpcyByZXF1aXJlZCB0byBiZSBhbiBBcnJheVwiXG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRydW5uZXJDb25maWcuaW5jbHVkZS5mb3JFYWNoKChmaWxlT3JEaXIpID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IGV4aXN0cyA9IGZzLmV4aXN0c1N5bmMoZmlsZU9yRGlyKTtcblx0XHRcdFx0XHRcdGlmICghZXhpc3RzKSB7XG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBDb25maWdFcnJvcihcblx0XHRcdFx0XHRcdFx0XHRcInJ1bm5lci5pbmNsdWRlXCIsXG5cdFx0XHRcdFx0XHRcdFx0YHBhdGggaW4gc2VxdWVuY2UgZG9lcyBub3QgZXhpc3QgLT4gXCIke2ZpbGVPckRpcn1cImBcblx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0fVxuXHR9O1xufVxuIl19