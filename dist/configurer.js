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
            collector: {
                use: "entryPoint",
            },
            volume: 3,
            bubbleHooks: false,
            colors: true,
            dev: false,
        };
        this.applyConfig = function (options, onTheFly) {
            if (options) {
                _this.validateConfig(options, onTheFly);
                _this.checkRequires(options);
                _this.config = Object.assign({}, _this.defaultConfiguration, options);
            }
        };
        this.checkRequires = function (config) {
            if (!config.require)
                return;
            for (var _i = 0, _a = config.require; _i < _a.length; _i++) {
                var requiredModule = _a[_i];
                try {
                    // synchronously require modules
                    require(requiredModule);
                }
                catch (err) {
                    if (err.code && err.code === "MODULE_NOT_FOUND") {
                        throw new types_1.ConfigError("require", "Could not find module " + requiredModule);
                    }
                    else {
                        throw err;
                    }
                }
            }
        };
        this.findConfig = function () {
            var pathToConfig = path_1.default.join(process.env["PWD"], "petzl.config.js");
            var configExists = fs_1.default.existsSync(pathToConfig);
            if (configExists) {
                var userConfigFile = require(pathToConfig);
                _this.applyConfig(userConfigFile, false);
            }
        };
        this.validateConfig = function (config, onTheFly) {
            var throwOnTheFly = function (optionName) {
                throw new types_1.ConfigError(optionName, "Cannot configure this option on the fly.");
            };
            if (!config)
                return;
            // dev
            if (config.dev && config.dev !== false) {
                if (config.dev === true) {
                    throw new types_1.ConfigError("dev", "dev can either be set to 'false' or DevConfiguration");
                }
                //TODO: VALIDATE DEV OPTIONS
            }
            // require
            if (config.require) {
                if (onTheFly) {
                    throwOnTheFly("require");
                }
                else {
                    for (var _i = 0, _a = config.require; _i < _a.length; _i++) {
                        var requiredModule = _a[_i];
                        if (typeof requiredModule !== "string") {
                            throw new types_1.ConfigError("require[" + requiredModule + "]", "Must be a string");
                        }
                    }
                }
            }
            // colors
            if (config.colors) {
                if (typeof config.colors !== "boolean") {
                    throw new types_1.ConfigError("colors", "Must be a boolean");
                }
            }
            // volume
            if (config.colors) {
                if (typeof config.colors !== "string") {
                    throw new types_1.ConfigError("colors", "Must be a string");
                }
            }
            // bubbleHooks
            if (config.bubbleHooks) {
                if (typeof config.colors !== "boolean") {
                    throw new types_1.ConfigError("bubbleHooks", "Must be a boolean");
                }
            }
            // collector
            if (config.collector && onTheFly) {
                throwOnTheFly("collector");
            }
            var collectorConfig = config.collector;
            if (types_1.isMatchExtensionsConfig(collectorConfig)) {
                // validate matchExtensions config
                if (collectorConfig.root) {
                    var rootExists = fs_1.default.existsSync(collectorConfig.root);
                    if (!rootExists) {
                        throw new types_1.ConfigError("collector.root", "directory " + collectorConfig.root + " does not exist");
                    }
                }
                else {
                    throw new types_1.ConfigError("collector.root", "is required to use the 'matchExtensions' collector");
                }
                if (!collectorConfig.match) {
                    throw new types_1.ConfigError("collector.match", "is required to use the 'matchExtensions' collector");
                }
                else {
                    if (!Array.isArray(collectorConfig.match)) {
                        throw new types_1.ConfigError("collector.root", "must be an Array");
                    }
                    else {
                        for (var _b = 0, _c = collectorConfig.match; _b < _c.length; _b++) {
                            var matcher = _c[_b];
                            if (matcher.charAt(0) !== ".") {
                                throw new types_1.ConfigError("collector.match", ": Matcher should begin with '.', but got '" + matcher + "'");
                            }
                        }
                    }
                }
            }
            else if (types_1.isEntryPointConfig(collectorConfig)) {
                // validate
            }
            else if (types_1.isSequencerConfig(collectorConfig)) {
                // validate sequencer config
                //TODO: Validate 'ignore' option
                if (!collectorConfig.sequence) {
                    throw new types_1.ConfigError("collector.sequence", "is required to use the 'sequencer' collector");
                }
                else {
                    if (!Array.isArray(collectorConfig.sequence)) {
                        throw new types_1.ConfigError("collector.sequence", "is required to be an Array");
                    }
                    else {
                        collectorConfig.sequence.forEach(function (fileOrDir) {
                            var exists = fs_1.default.existsSync(fileOrDir);
                            if (!exists) {
                                throw new types_1.ConfigError("collector.include", "path in sequence does not exist -> \"" + fileOrDir + "\"");
                            }
                        });
                    }
                }
            }
        };
        this.config = this.defaultConfiguration;
        if (options) {
            this.applyConfig(options, false);
        }
        else {
            this.findConfig();
        }
    }
    return Configurer;
}());
exports.default = Configurer;
//# sourceMappingURL=configurer.js.map