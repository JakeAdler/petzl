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
//# sourceMappingURL=configurer.js.map