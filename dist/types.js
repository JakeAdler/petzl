"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSequencerConfig = exports.isMatchExtensionsConfig = exports.isEntryPointConfig = exports.isDoOnceAction = exports.isConfigurationAction = exports.isDescribeEndAction = exports.isDescribeStartAction = exports.isItAction = exports.isHookAction = exports.ConfigError = void 0;
// Errors
var ConfigError = /** @class */ (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(optionName, message) {
        var _this = _super.call(this, "Option '" + optionName + "': " + message) || this;
        _this.name = "Config Error";
        return _this;
    }
    return ConfigError;
}(Error));
exports.ConfigError = ConfigError;
// Guards
var isHookAction = function (action) {
    return action.type === "hook";
};
exports.isHookAction = isHookAction;
var isItAction = function (action) {
    return action.type === "it";
};
exports.isItAction = isItAction;
var isDescribeStartAction = function (action) {
    return action.type === "describe-start";
};
exports.isDescribeStartAction = isDescribeStartAction;
var isDescribeEndAction = function (action) {
    return action.type === "describe-end";
};
exports.isDescribeEndAction = isDescribeEndAction;
var isConfigurationAction = function (action) {
    return action.type === "configure";
};
exports.isConfigurationAction = isConfigurationAction;
var isDoOnceAction = function (action) {
    return action.type === "doOnce";
};
exports.isDoOnceAction = isDoOnceAction;
var isEntryPointConfig = function (config) {
    return config.use === "entryPoint";
};
exports.isEntryPointConfig = isEntryPointConfig;
var isMatchExtensionsConfig = function (config) {
    return config.use === "matchExtensions";
};
exports.isMatchExtensionsConfig = isMatchExtensionsConfig;
var isSequencerConfig = function (config) {
    return config.use === "sequencer";
};
exports.isSequencerConfig = isSequencerConfig;
//# sourceMappingURL=types.js.map