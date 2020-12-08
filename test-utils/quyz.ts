import { Quyz } from "../dist/quyz";

class Store {
	logs: string[][] = [];

	pushToLogs = (...args: any[]) => {
		this.logs.push(args);
	};

	getLogs = () => {
		return this.logs;
	};

	reset = () => {
		this.logs = [];
	};
}
const store = new Store();

const quyz = new Quyz({
	dev: {
		logger: {
			log: store.pushToLogs,
		},
	},
	colors: false,
	collector: {
		use: "sequencer",
		sequence: ["test-utils/suites/it.ts"],
	},
});

const reset = () => {
	quyz.dev.resetRunner();
	store.reset();
};

export { quyz, store, reset };
