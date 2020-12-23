import { it, describe, assert, afterEach } from "../dist";
import { quyz } from "./utils/";
import {
	isGlobalSetupAction,
	isGlobalTeardownAction,
	isItAction,
} from "../dist/types";

describe("global actions", () => {
	afterEach(() => {
		quyz.dev.reset();
	});

	describe("globalSetup", () => {
		it("should be first in queue", async () => {
			quyz.it("foo", () => {});
			quyz.globalSetup(() => {});

			const beforeQueue = quyz.dev.getQueue();

			assert(isItAction(beforeQueue[0]));
			assert(isGlobalSetupAction(beforeQueue[1]));

			await quyz.dev.runner.processQueue();

			const processedQueue = quyz.dev.getQueue();

			assert(isGlobalSetupAction(processedQueue[0]));
			assert(isItAction(processedQueue[1]));
		});

		it("should be first in queue if defined in async describe", async () => {
			quyz.describe("foo", async () => {
				quyz.it("bar", () => {});
				quyz.globalSetup(() => {});
			});

			await quyz.dev.runner.processQueue();

			const processedQueue = quyz.dev.runner.queue;

			assert(isGlobalSetupAction(processedQueue[0]));
		});
	});

	describe("globalTeardown", () => {
		it("should be last in queue", async () => {
			quyz.globalTeardown(() => {});
			quyz.it("foo", () => {});

			const beforeQueue = quyz.dev.getQueue();

			assert(isGlobalTeardownAction(beforeQueue[0]));
			assert(isItAction(beforeQueue[1]));

			await quyz.dev.runner.processQueue();

			const processedQueue = quyz.dev.getQueue();

			assert(isItAction(processedQueue[0]));
			assert(isGlobalTeardownAction(processedQueue[1]));
		});

		it("should be last in queue if defined in async describe", async () => {
			quyz.describe("foo", async () => {
				quyz.globalTeardown(() => {});
				quyz.it("bar", () => {});
			});

			await quyz.dev.runner.processQueue();

			const processedQueue = quyz.dev.getQueue();

			const len = processedQueue.length;

			assert(isGlobalTeardownAction(processedQueue[len - 1]));

		});
	});
});
