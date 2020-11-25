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
const perf_hooks_1 = require("perf_hooks");
const logger_1 = __importDefault(require("./logger"));
const summarize_1 = __importDefault(require("./summarize"));
const types_1 = require("./types");
const defaultConfiguration = {
    logger: console,
    autoReport: true,
    colors: true,
    format: true,
    symbols: true,
};
class Clock {
    constructor() {
        this.startTime = 0;
        this.endTime = 0;
        this.start = () => {
            this.startTime = perf_hooks_1.performance.now();
        };
        this.stop = () => {
            this.endTime = perf_hooks_1.performance.now();
        };
        this.calc = () => {
            return Math.round(Math.abs(this.endTime - this.startTime));
        };
    }
}
class Petzl {
    constructor(configuration) {
        this.context = {
            passed: 0,
            failed: 0,
            totalRuntime: 0,
            errors: [],
        };
        this.pass = (title, clock) => {
            clock.stop();
            const runtime = clock.calc();
            this.logger.log(this.logger.colors.green("PASSED: "), title, this.logger.colors.green(`(${runtime}ms)`));
            this.context.passed += 1;
            if (runtime > 0) {
                this.context.totalRuntime += runtime;
            }
            this.logger.releaseConsoleLogs();
        };
        this.fail = (title, clock, error) => {
            clock.stop();
            const runtime = clock.calc();
            this.logger.log(this.logger.colors.red("FAILED: "), title, this.logger.colors.red(`(${runtime}ms)`));
            this.context.failed += 1;
            this.context.errors.push([error, title]);
            if (runtime > 0) {
                this.context.totalRuntime += runtime;
            }
            this.logger.releaseConsoleLogs();
        };
        this.configure = (options) => {
            this.config = Object.assign(this.config, options);
            this.logger = new logger_1.default(this.config);
        };
        this.explode = (message) => {
            throw new types_1.Explosion(message);
        };
        this.canItBeRun = true;
        this.it = (title, cb, ...args) => {
            if (!this.canItBeRun) {
                throw new types_1.NestedTestError(`\n Cannot nest ${this.logger.colors.bold("it")} blocks \n`);
            }
            this.canItBeRun = false;
            const clock = new Clock();
            const formattedTitle = this.logger.formatTitle(title, ...args);
            const pass = () => {
                this.pass(formattedTitle, clock);
                this.canItBeRun = true;
            };
            const fail = (err) => {
                this.fail(formattedTitle, clock, err);
                this.canItBeRun = true;
            };
            const handleError = (err) => {
                if (err instanceof types_1.Explosion) {
                    throw { __explosion: true, message: err.message, err };
                }
                else {
                    fail(err);
                }
            };
            try {
                this.logger.hijackConsoleLogs();
                clock.start();
                const possiblePromise = cb(...args);
                if (possiblePromise instanceof Promise) {
                    // Resolve promise cb
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield possiblePromise;
                            pass();
                        }
                        catch (err) {
                            handleError(err);
                        }
                        finally {
                            resolve();
                        }
                    }));
                }
                else {
                    // Resolve sync cb
                    pass();
                }
            }
            catch (err) {
                handleError(err);
            }
        };
        this.describe = (title, cb, ...args) => {
            const formattedTitle = this.logger.formatTitle(title, ...args);
            this.logger.log(chalk_1.default.underline.bold(formattedTitle));
            this.logger.addPadding();
            let isPromise = false;
            try {
                const promise = cb(...args);
                if (promise instanceof Promise) {
                    isPromise = true;
                    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield promise;
                        }
                        finally {
                            this.logger.subtractPadding();
                            resolve();
                        }
                    }));
                }
            }
            finally {
                if (!isPromise) {
                    this.logger.subtractPadding();
                }
            }
        };
        configuration = Object.assign({}, configuration, defaultConfiguration);
        const { logger, autoReport, colors, format, symbols } = configuration;
        this.config = configuration;
        this.logger = new logger_1.default({ logger, colors, format, symbols });
        process.on("unhandledRejection", (reason) => {
            if (reason["__explosion"]) {
                this.logger.log(this.logger.colors.red(`\nExplosion: ${reason["message"]}\n`));
                this.logger.log(reason["err"], "\n");
            }
            else {
                this.logger.log(this.logger.colors.red("\nFatal: unhandled rejection\n"));
                this.logger.log(reason, "\n");
            }
            process.exit(1);
        });
        process.on("uncaughtException", (error) => {
            this.logger.log(this.logger.colors.red("\nFatal: uncaught exception\n"));
            this.logger.log(error, "\n");
            process.exit(1);
        });
        process.on("beforeExit", (code) => __awaiter(this, void 0, void 0, function* () {
            if (!code) {
                const main = require(process.argv[1]).default;
                yield main();
            }
            process.exit();
        }));
        if (autoReport !== false) {
            process.on("exit", (code) => {
                if (code === 0) {
                    summarize_1.default(this.logger, this.context, configuration);
                }
            });
        }
    }
}
exports.default = Petzl;
