"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Petzl = exports.configure = exports.afterEach = exports.beforeEach = exports.describe = exports.it = void 0;
const petzl_1 = __importDefault(require("./petzl"));
exports.Petzl = petzl_1.default;
const petzl = new petzl_1.default();
const { it, describe, beforeEach, afterEach, configure } = petzl;
exports.it = it;
exports.describe = describe;
exports.beforeEach = beforeEach;
exports.afterEach = afterEach;
exports.configure = configure;
exports.default = petzl;
