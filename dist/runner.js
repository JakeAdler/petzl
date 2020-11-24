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
const report_1 = __importDefault(require("./report"));
const globby_1 = __importDefault(require("globby"));
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const path_1 = __importDefault(require("path"));
let runner = {
    tests: [],
    run: () => __awaiter(void 0, void 0, void 0, function* () {
        const glob = "../test/*.ts";
        const pathsToRun = yield globby_1.default(["test"], { gitignore: true });
        console.log("hell");
        const rootDir = yield pkg_dir_1.default();
        for (const rawPath of pathsToRun) {
            const testPath = path_1.default.posix.join(rootDir, rawPath);
            yield require(testPath);
        }
        process.on("beforeExit", () => {
            report_1.default();
        });
    })
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield runner.run();
}))();
