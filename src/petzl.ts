import { performance } from "perf_hooks";
import Logger from "./logger";
import summarize from "./summarize";
import {
	AnyCB,
	Configuration,
	Title,
	TestCB,
	Hooks,
	Action,
	HookAction,
	ItAction,
	DescribeStartAction,
	DescribeEndAction,
	isDescribeStartAction,
	isDescribeEndAction,
	isHookAction,
	isItAction,
} from "./types";

const defaultConfiguration: Configuration = {
	logger: console,
	colors: true,
	format: true,
	symbols: true,
	autoRun: true,
};

class Clock {
	constructor() {
		this.start();
	}

	private startTime = 0;
	private endTime = 0;

	public start = () => {
		this.startTime = performance.now();
	};

	public calc = (): number => {
		this.endTime = performance.now();
		return Math.round(Math.abs(this.endTime - this.startTime));
	};
}

class Petzl {
	private logger: Logger;
	private config: Configuration;

	constructor(configuration?: Configuration) {
		configuration = Object.assign({}, defaultConfiguration, configuration);

		this.config = configuration;

		this.logger = new Logger(this.config);

		if (configuration.autoRun === true) {
			setImmediate(() => {
				require(process.argv[1]);
				this.runQueue().then(() => {
					summarize(this.logger, this.context, this.config);
				});
			});
		}
	}

	public configure = (options: Partial<Configuration>) => {
		this.config = Object.assign(this.config, options);
		this.logger = new Logger(this.config);
	};

	private context = {
		passed: 0,
		failed: 0,
		totalRuntime: 0,
		errors: [],
	};

	private hooks: Hooks = {
		beforeEach: () => {},
		afterEach: () => {},
	};

	private hooksCache: Hooks = {
		beforeEach: () => {},
		afterEach: () => {},
	};

	private useCachedHooks = () => {
		this.hooks = Object.assign(this.hooks, this.hooksCache);
	};

	private pushHookToQueue = (hookName: keyof Hooks, cb: AnyCB) => {
		const action: HookAction = {
			type: "hook",
			cb: () => {
				this.hooks[hookName] = cb;
			},
		};
		this.queue.push(action);
	};

	private cacheAndResetHooks = () => {
		this.hooksCache = Object.assign(this.hooksCache, this.hooks);

		for (const hook in this.hooks) {
			this.hooks[hook] = () => {};
		}
	};

	private runHook = async (hookName: keyof Hooks) => {
		this.logger.hijackConsoleLogs();

		await this.hooks[hookName]();

		this.logger.releaseHookLog(hookName);
	};

	public beforeEach = (cb: AnyCB) => {
		this.pushHookToQueue("beforeEach", cb);
	};

	public afterEach = (cb: AnyCB) => {
		this.pushHookToQueue("afterEach", cb);
	};

	private queue: Action[] = [];

	private runQueue = async () => {
		const {
			queue,
			evaluateTest: executeTest,
			startGroup,
			stopGroup,
		} = this;

		for (const action of queue) {
			if (isHookAction(action)) {
				action.cb();
			}

			if (isItAction(action)) {
				await executeTest(action);
			}

			if (isDescribeStartAction(action)) {
				startGroup(action);
			}

			if (isDescribeEndAction(action)) {
				stopGroup();
			}
		}
	};

	private startGroup = async (group: DescribeStartAction) => {
		const { logger, cacheAndResetHooks } = this;
		logger.logGroupTitle(group.title);
		cacheAndResetHooks();
	};

	private stopGroup = () => {
		const { logger, useCachedHooks } = this;
		logger.subtractPadding();
		useCachedHooks();
	};

	private evaluateTest = async <T extends any[]>(
		action: ItAction<T>
	): Promise<void> => {
		const { title, cb, args } = action;

		const { context, logger, runHook } = this;

		await runHook("beforeEach");

		logger.hijackConsoleLogs();

		const clock = new Clock();

		try {
			await cb(...args);

			// Pass
			const runtime = clock.calc();

			logger.pass(title, runtime);

			context.passed += 1;

			if (runtime > 0) {
				context.totalRuntime += runtime;
			}

			logger.releaseTestLog();
		} catch (err) {
			// Fail
			const runtime = clock.calc();

			logger.fail(title, runtime);

			context.failed += 1;

			context.errors.push([err, title]);

			if (runtime > 0) {
				context.totalRuntime += runtime;
			}

			logger.releaseTestLog();
		} finally {
			await runHook("afterEach");
		}
	};

	public it = <T extends any[]>(
		title: Title<T>,
		cb: TestCB<T>,
		...args: T
	): ReturnType<typeof cb> => {
		title = this.logger.formatTitle(title, ...args);

		const action: ItAction<T> = {
			type: "it",
			title,
			cb,
			args,
		};

		this.queue.push(action);
	};

	public describe = <T extends any[]>(
		title: Title<T>,
		cb: TestCB<T>,
		...args: T
	): ReturnType<typeof cb> => {
		title = this.logger.formatTitle(title, ...args);

		const startAction: DescribeStartAction = {
			type: "describe-start",
			title,
		};

		this.queue.push(startAction);

		cb(...args);

		const endAction: DescribeEndAction = {
			type: "describe-end",
		};

		this.queue.push(endAction);
	};
}

export default Petzl;
