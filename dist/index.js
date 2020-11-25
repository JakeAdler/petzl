"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarize = exports.explode = exports.configure = exports.describe = exports.it = void 0;
const petzl_1 = __importDefault(require("./petzl"));
const summarize_1 = __importDefault(require("./summarize"));
exports.summarize = summarize_1.default;
exports.default = petzl_1.default;
const { it, describe, configure, explode } = new petzl_1.default();
exports.it = it;
exports.describe = describe;
exports.configure = configure;
exports.explode = explode;
