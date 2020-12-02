import Logger from "./logger";
import Hijacker from "./hijacker";
import { Clock } from "./utils";
import summarize from "./summarize";
import {
	Action,
	ItAction,
	DescribeStartAction,
	isDescribeStartAction,
	isDescribeEndAction,
	isHookAction,
	isItAction,
	isConfigurationAction,
	isDoOnceAction,
	Hooks,
	HookAction,
	AnyCB,
	Configuration,
} from "./types";

export default class Queue {
	config: Configuration;
	logger: Logger;
	hijacker: Hijacker;

	constructor(config: Configuration) {
		this.config = config;
		this.logger = new Logger(this.config);
		this.hijacker = new Hijacker(this.logger, this.config);
	}

	public context = {
		passed: 0,
		failed: 0,
		testRuntime: 0,
		errors: [],
	};

	public queue: Action[] = [];

	public pushAction = <A extends Action>(action: A) => {
		this.queue.push(action);
	};

	private reloadConfig = (options: Partial<Configuration>) => {
		this.hijacker.resetGlobalLog();
		this.config = Object.assign(this.config, options);
		this.logger = new Logger(this.config);
		this.hijacker = new Hijacker(this.logger, this.config);
	};

	public run = async () => {
		const { queue, evaluateTest, startGroup, stopGroup } = this;

		try {
			for (let i = 0; i < queue.length; i++) {
				const action = queue[i];

				if (isHookAction(action)) {
					await action.cb();
				}

				if (isItAction(action)) {
					await evaluateTest(action);
				}

				if (isDescribeStartAction(action)) {
					await startGroup(action);
				}

				if (isDescribeEndAction(action)) {
					await stopGroup();
				}

				if (isDoOnceAction(action)) {
					await action.cb();
				}

				if (isConfigurationAction(action)) {
					this.reloadConfig(action.configuration);
				}
			}
		} finally {
			this.logger.dumpLogs();
			summarize(this.logger, this.context, this.config);
		}
	};

	private hooks: Hooks = {
		beforeEach: () => {},
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

	public runHook = async (hookName: keyof Hooks, testName: string) => {
		this.hijacker.hijackConsoleLogs();
		await this.hooks[hookName]();
		this.hijacker.releaseHookLog(hookName, testName);
	};

	public pushHookAction = (hookName: keyof Hooks, cb: AnyCB) => {
		const action: HookAction = {
			type: "hook",
			cb: () => {
				this.hooks[hookName] = cb;
			},
		};
		this.pushAction(action);
	};

	private startGroup = async (group: DescribeStartAction) => {
		const { logger, cacheAndResetHooks } = this;
		logger.addPadding();
		logger.logGroupTitle(group.title);
		cacheAndResetHooks();
	};

	private stopGroup = async () => {
		const { logger, useCachedHooks } = this;
		logger.subtractPadding();
		useCachedHooks();
	};

	private evaluateTest = async <T extends any[]>(
		action: ItAction<T>
	): Promise<void> => {
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
