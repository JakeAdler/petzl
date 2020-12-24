import Collector from "./collector";
import Runner from "./runner";

export default class Dev {
	public runner: Runner;
	public collector: Collector;

	constructor(runner: Runner, collector: Collector) {
		this.runner = runner;
		this.collector = collector;
	}

	getQueue = () => {
		return this.runner.queue;
	};

	getContext = () => {
		return this.runner.context;
	};

	getHooks = () => {
		return this.runner.hooks;
	};

	getLogs = () => {
		return devLogStore.getLogs();
	};

	reset = () => {
		this.runner.reset();
		devLogStore.reset();
	};
}

class DevLogStore {
	private logs = [];

	getLogs = () => this.logs;

	reset = () => {
		this.logs = [];
	};

	log = (...args: any[]) => {
		this.logs.push(args);
	};
}

export const devLogStore = new DevLogStore();
