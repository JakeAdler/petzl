"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const log_1 = require("./log");
const group = (title, cb) => {
    const formattedTitle = title.trim() + ":";
    log_1.log(chalk_1.default.underline.bold(formattedTitle));
    log_1.addPadding();
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        yield cb();
        resolve();
    })).then(() => {
        log_1.subtractPadding();
    });
};
exports.default = group;
