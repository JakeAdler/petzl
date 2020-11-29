"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConfigurationAction = exports.isDescribeEndAction = exports.isDescribeStartAction = exports.isItAction = exports.isHookAction = exports.NestedTestError = void 0;
class NestedTestError extends Error {
}
exports.NestedTestError = NestedTestError;
// Guards
const isHookAction = (action) => {
    return action.type === "hook";
};
exports.isHookAction = isHookAction;
const isItAction = (action) => {
    return action.type === "it";
};
exports.isItAction = isItAction;
const isDescribeStartAction = (action) => {
    return action.type === "describe-start";
};
exports.isDescribeStartAction = isDescribeStartAction;
const isDescribeEndAction = (action) => {
    return action.type === "describe-end";
};
exports.isDescribeEndAction = isDescribeEndAction;
const isConfigurationAction = (action) => {
    return action.type === "configure";
};
exports.isConfigurationAction = isConfigurationAction;
