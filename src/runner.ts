import Logger from "./logger";
import Hijacker from "./hijacker";
import Configurer from "./configurer";
import { Clock } from "./utils";
import Summarizer from "./summarize";
import {
	Action,
	ItAction,
	DescribeStartAction,
	isDescribeStartAction,
	isDescribeEndAction,
	isHookAction,
	isItAction,
	isDoOnceAction,
	Hooks,
	SetHookAction,
	AnyCB,
	Configuration,
	Context,
	DoOnceAction,
	isFileStartAction,
	FileStartAction,
	isFileEndAction,
	FileEndAction,
	DescribeEndAction,
	isGroupStartAction,
	isGroupEndAction,
} from "./types";

export default class Runner {
	configurer: Configurer;
	config: Configuration;
	logger: Logger;
	hijacker: Hijacker;
	summarizer: Summarizer;
	dev: boolean;

	constructor(configurer: Configurer) {
		this.configurer = configurer;
		this.config = this.configurer.config;
		this.dev = this.config.dev === false ? false : true;
		this.logger = new Logger(this.config);
		this.hijacker = new Hijacker(this.logger, this.config);
		this.summarizer = new Summarizer(this.logger, this.config);
	}

	public context: Context = {
		passed: 0,
		failed: 0,
		testRuntime: 0,
		errors: [],
	};

	public queue: Action[] = [];

	public pushAction = <A extends Action>(action: A) => {
		this.queue.push(action);
	};

	public resetRunner = () => {
		if (this.dev) {
			this.queue = [];
			this.context = {
				passed: 0,
				failed: 0,
				testRuntime: 0,
				errors: [],
			};
			this.logger.logQueue = [];
		} else {
			throw new Error("This is a dev method, and dev is not set to true");
		}
	};

	public run = async () => {
		const {
			queue,
			handleItAction,
			handleGroupStartAction,
			handleGroupEndAction,
			handleDoOnceAction,
		} = this;

		await this.processQueue();

		if (!this.dev) {
			this.summarizer.updateSummary(this.context, queue);
		}

		try {
			for (let i = 0; i < queue.length; i++) {
				const action = queue[i];

				if (isGroupStartAction(action)) {
					await handleGroupStartAction(action);
				}

				if (isDoOnceAction(action)) {
					await handleDoOnceAction(action);
				}

				if (isItAction(action)) {
					await handleItAction(action);
				}

				if (isGroupEndAction(action)) {
					await handleGroupEndAction(action);
				}

				if (isFileEndAction(action)) {
				}
			}
		} finally {
			if (!this.dev) {
				this.summarizer.clearSummary();
			}
			this.hijacker.resetGlobalLog();
			this.summarizer.endReport(this.context);
		}
	};

	private processQueue = async () => {
		let processed: Action[] = [],
			contextStartIndex = 0;

		for (let i = 0; i < this.queue.length; i++) {
			const action = this.queue[i];
			if (isDescribeStartAction(action) || isFileStartAction(action)) {
				contextStartIndex = i;
			}

			if (isHookAction(action)) {
				const contextStartAction = this.queue[contextStartIndex];

				if (isGroupStartAction(contextStartAction)) {
					contextStartAction.hooks.push(action.cb);
					continue;
				}
			}

			processed.push(action);
		}

		this.queue = processed;
	};

	public hooks: Hooks = {
		beforeAll: () => {},
		beforeEach: () => {},
		afterAll: () => {},
		afterEach: () => {},
	};

	private hooksCache: Hooks[] = [];

	public useCachedHooks = () => {
		this.hooks = Object.assign(this.hooks, this.hooksCache.pop());
	};

	public cacheAndResetHooks = () => {
		this.hooksCache.push({ ...this.hooks });

		if (this.config.bubbleHooks !== true) {
			for (const hook in this.hooks) {
				this.hooks[hook] = () => {};
			}
		}
	};

	private runCb = async (cb: AnyCB, location: string) => {
		try {
			await cb();
		} catch (err) {
			this.context.errors.push([err, location]);
		}
	};

	private runHook = async (hookName: keyof Hooks, testName?: string) => {
		this.hijacker.hijackConsoleLogs();
		await this.runCb(this.hooks[hookName], `(hook) ${hookName}`);
		this.hijacker.releaseHookLog(hookName, testName);
	};

	public pushHookAction = (hookName: keyof Hooks, cb: AnyCB) => {
		const action: SetHookAction = {
			type: "setHook",
			cb: () => {
				this.hooks[hookName] = cb;
			},
		};
		this.pushAction(action);
	};

	private handleDoOnceAction = async (action: DoOnceAction) => {
		this.hijacker.hijackConsoleLogs();
		await this.runCb(action.cb, "(hook) doOnce");
		this.hijacker.releaseDoOnceLog();
	};

	private handleGroupStartAction = async (
		action: FileStartAction | DescribeStartAction
	) => {
		const { logger, cacheAndResetHooks } = this;

		if (isDescribeStartAction(action)) {
			logger.logGroupTitle(action.title);
			logger.addPadding();
		}

		if (isFileStartAction(action)) {
			logger.logTestFileName(action.title);
		}

		cacheAndResetHooks();

		for (const hook of action.hooks) {
			hook();
		}

		this.runHook("beforeAll");
	};

	private handleGroupEndAction = async (
		action: DescribeEndAction | FileEndAction
	) => {
		const { logger, useCachedHooks } = this;

		await this.runHook("afterAll");

		if (isDescribeEndAction(action)) {
			logger.subtractPadding();
		}

		useCachedHooks();
	};

	private handleItAction = async <T extends any[]>(
		action: ItAction<T>
	): Promise<void> => {
		this.summarizer.clearSummary();
		this.summarizer.updateSummary(this.context, this.queue);
		const { title, cb, args } = action;

		const { context, logger, hijacker, runHook } = this;

		await runHook("beforeEach", title);

		hijacker.hijackConsoleLogs();

		const clock = new Clock();

		let didPass: boolean;
		let runtime: number;
		try {
			await cb(...args);

			// Pass
			runtime = clock.calc();

			logger.pass(title, runtime);

			context.passed += 1;

			if (runtime > 0) {
				context.testRuntime += runtime;
			}
			didPass = true;
		} catch (err) {
			// Fail
			didPass = false;
			runtime = clock.calc();

			logger.fail(title, runtime);

			context.failed += 1;

			context.errors.push([err, title]);

			if (runtime > 0) {
				context.testRuntime += runtime;
			}
		} finally {
			hijacker.releaseTestLog(title, runtime, didPass);
			await runHook("afterEach", title);
		}
	};
}
