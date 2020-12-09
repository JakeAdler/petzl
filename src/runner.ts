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
		this.dev = this.config.dev;
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

	public hooks: Hooks = {
		beforeAll: () => {},
		beforeEach: () => {},
		afterAll: () => {},
		afterEach: () => {},
	};

	private hooksCache: Hooks[] = [];

	public pushAction = <A extends Action>(action: A) => {
		this.queue.push(action);
	};

	// Public methods
	public pushHookAction = (hookName: keyof Hooks, cb: AnyCB) => {
		const action: SetHookAction = {
			type: "setHook",
			cb: () => {
				this.hooks[hookName] = cb;
			},
		};
		this.pushAction(action);
	};

	public reset = () => {
		if (this.dev) {
			this.queue.filter(isFileStartAction).forEach((action) => {
				delete require.cache[action.title];
			});
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
			dev,
			context,
			queue,
			handleItAction,
			handleGroupStartAction,
			handleGroupEndAction,
			handleDoOnceAction,
			summarizer,
		} = this;

		await this.processQueue();

		if (!dev) {
			summarizer.updateSummary(context, queue, false);
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
			}
		} finally {
			if (!dev) {
				summarizer.clearSummary();
			}
			this.hijacker.resetGlobalLog();
			summarizer.endReport(context);
		}
	};

	// Private helpers

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

	private useCachedHooks = () => {
		this.hooks = Object.assign(this.hooks, this.hooksCache.pop());
	};

	private cacheAndResetHooks = () => {
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

	// Handlers

	private handleDoOnceAction = async (action: DoOnceAction) => {
		this.hijacker.hijackConsoleLogs();
		await this.runCb(action.cb, "(hook) doOnce");
		this.hijacker.releaseDoOnceLog();
	};

	private handleGroupStartAction = async (
		action: FileStartAction | DescribeStartAction
	) => {
		if (isDescribeStartAction(action)) {
			this.logger.logGroupTitle(action.title);
		}

		if (isFileStartAction(action) && this.config.printFileNames) {
			this.logger.logTestFileName(action.title);
		}

		this.cacheAndResetHooks();

		for (const hookSetter of action.hooks) {
			hookSetter();
		}

		await this.runHook("beforeAll");
	};

	private handleGroupEndAction = async (
		action: DescribeEndAction | FileEndAction
	) => {
		await this.runHook("afterAll");

		if (isDescribeEndAction(action)) {
			this.logger.subtractPadding();
		}

		this.useCachedHooks();
	};

	private handleItAction = async <T extends any[]>({
		title,
		cb,
		args,
	}: ItAction<T>): Promise<void> => {
		const { context, logger, hijacker, runHook, queue } = this;

		this.summarizer.updateSummary(context, queue);

		await runHook("beforeEach", title);

		hijacker.hijackConsoleLogs();

		let didPass: boolean, runtime: number;

		const clock = new Clock();

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
