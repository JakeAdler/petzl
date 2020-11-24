"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtractPadding = exports.addPadding = exports.log = void 0;
let padding = "";
const log = (...messages) => {
    if (padding.length) {
        console.log(padding, ...messages);
    }
    else {
        console.log(...messages);
    }
};
exports.log = log;
const addPadding = () => {
    padding += "  ";
};
exports.addPadding = addPadding;
const subtractPadding = () => {
    padding = padding.slice(0, padding.length - 2);
};
exports.subtractPadding = subtractPadding;
