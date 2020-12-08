import Collector from "./collector";
import Runner from "./runner";

export default class Dev {
	private runner: Runner;
	private collector: Collector;

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

	collect = async (path: string) => {
		await this.collector.devCollect(path);
	};

	resetRunner = () => {
		this.runner.resetRunner();
	};
}
