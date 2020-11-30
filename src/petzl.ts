import { formatTitle, registerProcessEventListeners } from "./utils";
import { AnyVoidCB, Configuration, Title, TestCB, AnyCB } from "./types";
import Queue from "./queue";
import Runner from "./runner";
import Configurer from "./configurer";

class Petzl {
	private config: Configuration;
	private queue: Queue;
	public runner: Runner;

	constructor(configuration?: Configuration) {
		registerProcessEventListeners()
		const { config } = new Configurer(configuration);
		this.config = config;
		this.queue = new Queue(this.config);
		this.runner = new Runner(this.queue, this.config);
	}

	public beforeEach = (cb: AnyVoidCB) => {
		this.queue.pushHookAction("beforeEach", cb);
	};

	public afterEach = (cb: AnyVoidCB) => {
		this.queue.pushHookAction("afterEach", cb);
	};

	public doOnce = (cb: AnyCB) => {
		this.queue.pushAction({
			type: "doOnce",
			cb: async () => {
				return await cb();
			},
		});
	};

	public configure = (options: Omit<Configuration, "autoRun">) => {
		this.queue.pushAction({
			type: "configure",
			configuration: options,
		});
	};

	public it = <T extends any[]>(
		title: Title<T>,
		cb: TestCB<T>,
		...args: T
	): void => {
		this.queue.pushAction({
			type: "it",
			title: formatTitle(title, ...args),
			cb,
			args,
		});
	};

	public describe = <T extends any[]>(
		title: Title<T>,
		cb: (...args: T) => void,
		...args: T
	): void => {
		this.queue.pushAction({
			type: "describe-start",
			title: formatTitle(title, ...args),
		});

		cb(...args);

		this.queue.pushAction({
			type: "describe-end",
		});
	};
}

const petzl = new Petzl();

const {
	it,
	describe,
	beforeEach,
	afterEach,
	doOnce,
	configure,
	runner,
} = petzl;

export {
	it,
	describe,
	beforeEach,
	afterEach,
	doOnce,
	configure,
	runner,
	Petzl,
};
