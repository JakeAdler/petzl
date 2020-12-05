import Runner from "./runner";
import Collector from "./collector";
import Configurer from "./configurer";
import { formatTitle, registerProcessEventListeners } from "./utils";
import { AnyVoidCB, Configuration, Title, TestCB, AnyCB } from "./types";

class Petzl {
	private runner: Runner;
	private configurer: Configurer;
	public collector: Collector;

	constructor(configuration?: Configuration) {
		registerProcessEventListeners();
		this.configurer = new Configurer(configuration);
		this.runner = new Runner(this.configurer);
		this.collector = new Collector(this.runner, this.configurer);
	}

	public beforeEach = (cb: AnyVoidCB) => {
		this.runner.pushHookAction("beforeEach", cb);
	};

	public afterEach = (cb: AnyVoidCB) => {
		this.runner.pushHookAction("afterEach", cb);
	};

	public doOnce = (cb: AnyCB) => {
		this.runner.pushAction({
			type: "doOnce",
			cb,
		});
	};

	public configure = (
		options: Omit<Configuration, "collector" | "require">
	) => {
		this.configurer.validateConfig(options, true);
		this.runner.pushAction({
			type: "configure",
			configuration: options,
		});
	};

	public it = <T extends any[]>(
		title: Title<T>,
		cb: TestCB<T>,
		...args: T
	): void => {
		this.runner.pushAction({
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
		this.runner.pushAction({
			type: "describe-start",
			title: formatTitle(title, ...args),
		});

		cb(...args);

		this.runner.pushAction({
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
	collector,
} = petzl;

export {
	it,
	describe,
	beforeEach,
	afterEach,
	doOnce,
	configure,
	collector,
	Petzl,
};
