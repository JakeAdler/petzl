import Logger from "./logger";
import Hijacker from "./hijacker";
import Configurer from "./configurer";
import { Clock } from "./utils";
import Summarizer from "./summarize";
import { performance } from "perf_hooks";
import {
	Action,
	ItAction,
	DescribeStartAction,
	isDescribeStartAction,
	isDescribeEndAction,
	isItAction,
	isDoOnceAction,
	Hooks,
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
	isDescribeAction,
} from "./types";

export default class Runner {
	config: Configuration;
	logger: Logger;
	hijacker: Hijacker;
	summarizer: Summarizer;
	dev: boolean;

	constructor(configurer: Configurer) {
		this.config = configurer.config;
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
		const lastGroupStart = this.queue.filter(isGroupStartAction);
		const index = this.queue.indexOf(
			lastGroupStart[lastGroupStart.length - 1]
		);

		const lastGroupStartAction = this.queue[index];

		if (isGroupStartAction(lastGroupStartAction)) {
			lastGroupStartAction.hooks.push(() => {
				this.hooks[hookName] = cb;
			});
		}
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
			handleItAction,
			handleGroupStartAction,
			handleGroupEndAction,
			handleDoOnceAction,
			summarizer,
		} = this;

		await this.processQueue();

		if (!dev) {
			summarizer.updateSummary(context, this.queue, false);
		}

		try {
			for (let i = 0; i < this.queue.length; i++) {
				const action = this.queue[i];

				if (isItAction(action)) {
					await handleItAction(action);
				}

				if (isDoOnceAction(action)) {
					await handleDoOnceAction(action);
				}

				if (isGroupStartAction(action)) {
					await handleGroupStartAction(action);
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

	private resolveDescribes = async () => {
		const walk = async (queue: Action[]) => {
			this.queue = [];
			for (const action of queue) {
				if (isDescribeAction(action)) {
					await action.cb(...action.args);
					await walk(this.queue);
				} else {
					this.pushAction(action);
				}
			}
		};

		await walk(this.queue);
	};

	public processQueue = async () => {
		await this.resolveDescribes();
	};

	private useCachedHooks = () => {
		this.hooks = Object.assign(this.hooks, this.hooksCache.pop());
	};

	private cacheAndResetHooks = () => {
		this.hooksCache.push({ ...this.hooks });

		if (!this.config.bubbleHooks) {
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
