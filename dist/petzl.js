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
const logger_1 = __importDefault(require("./logger"));
const hijacker_1 = __importDefault(require("./hijacker"));
const summarize_1 = __importDefault(require("./summarize"));
const utils_1 = require("./utils");
const types_1 = require("./types");
const defaultConfiguration = {
    logger: console,
    colors: true,
    format: true,
    symbols: true,
    autoRun: true,
    bubbleHooks: false,
    volume: 3,
};
class Petzl {
    constructor(configuration) {
        this.applyConfiguration = (action) => {
            this.hijacker.resetGlobalLog();
            this.config = Object.assign(this.config, action.configuration);
            this.logger = new logger_1.default(this.config);
            this.hijacker = new hijacker_1.default(this.logger);
        };
        this.context = {
            passed: 0,
            failed: 0,
            totalRuntime: 0,
            errors: [],
        };
        // Hooks
        this.hooks = {
            beforeEach: () => { },
            afterEach: () => { },
        };
        this.hooksCache = [];
        this.useCachedHooks = () => {
            this.hooks = Object.assign(this.hooks, this.hooksCache.pop());
        };
        this.pushHookToQueue = (hookName, cb) => {
            const action = {
                type: "hook",
                cb: () => {
                    this.hooks[hookName] = cb;
                },
            };
            this.queue.push(action);
        };
        this.cacheAndResetHooks = () => {
            this.hooksCache.push(Object.assign({}, this.hooks));
            if (this.config.bubbleHooks !== true) {
                for (const hook in this.hooks) {
                    this.hooks[hook] = () => { };
                }
            }
        };
        this.runHook = (hookName, testName) => __awaiter(this, void 0, void 0, function* () {
            this.hijacker.hijackConsoleLogs();
            yield this.hooks[hookName]();
            this.hijacker.releaseHookLog(hookName, testName);
        });
        this.beforeEach = (cb) => {
            this.pushHookToQueue("beforeEach", cb);
        };
        this.afterEach = (cb) => {
            this.pushHookToQueue("afterEach", cb);
        };
        // Queue
        this.queue = [];
        this.runQueue = () => __awaiter(this, void 0, void 0, function* () {
            const { queue, evaluateTest, startGroup, stopGroup, applyConfiguration, } = this;
            for (const action of queue) {
                if (types_1.isHookAction(action)) {
                    yield action.cb();
                }
                if (types_1.isItAction(action)) {
                    yield evaluateTest(action);
                }
                if (types_1.isDescribeStartAction(action)) {
                    yield startGroup(action);
                }
                if (types_1.isDescribeEndAction(action)) {
                    yield stopGroup();
                }
                if (types_1.isConfigurationAction(action)) {
                    applyConfiguration(action);
                }
            }
        });
        this.startGroup = (group) => __awaiter(this, void 0, void 0, function* () {
            const { logger, cacheAndResetHooks } = this;
            logger.logGroupTitle(group.title);
            cacheAndResetHooks();
        });
        this.stopGroup = () => __awaiter(this, void 0, void 0, function* () {
            const { logger, useCachedHooks } = this;
            logger.subtractPadding();
            useCachedHooks();
        });
        this.evaluateTest = (action) => __awaiter(this, void 0, void 0, function* () {
            const { title, cb, args } = action;
            const { context, logger, hijacker, runHook } = this;
            yield runHook("beforeEach", title);
            hijacker.hijackConsoleLogs();
            const clock = new utils_1.Clock();
            let didPass;
            try {
                yield cb(...args);
                // Pass
                const runtime = clock.calc();
                logger.pass(title, runtime);
                context.passed += 1;
                if (runtime > 0) {
                    context.totalRuntime += runtime;
                }
                didPass = true;
            }
            catch (err) {
                // Fail
                const runtime = clock.calc();
                logger.fail(title, runtime);
                context.failed += 1;
                context.errors.push([err, title]);
                if (runtime > 0) {
                    context.totalRuntime += runtime;
                }
                didPass = false;
            }
            finally {
                hijacker.releaseTestLog(title, didPass);
                yield runHook("afterEach", title);
            }
        });
        this.configure = (options) => {
            const configureAction = {
                type: "configure",
                configuration: options,
            };
            this.queue.push(configureAction);
        };
        this.it = (title, cb, ...args) => {
            const action = {
                type: "it",
                title: utils_1.formatTitle(title, ...args),
                cb,
                args,
            };
            this.queue.push(action);
        };
        this.describe = (title, cb, ...args) => {
            const startAction = {
                type: "describe-start",
                title: utils_1.formatTitle(title, ...args),
            };
            this.queue.push(startAction);
            cb(...args);
            const endAction = {
                type: "describe-end",
            };
            this.queue.push(endAction);
        };
        configuration = Object.assign({}, defaultConfiguration, configuration);
        this.config = configuration;
        this.logger = new logger_1.default(this.config);
        this.hijacker = new hijacker_1.default(this.logger);
        if (configuration.autoRun === true) {
            setImmediate(() => {
                require(process.argv[1]);
                this.runQueue().then(() => {
                    summarize_1.default(this.logger, this.context, this.config);
                });
            });
        }
    }
}
exports.default = Petzl;
