import Collector from "./collector";

// Function types
type AnyVoid = Promise<void> | void;

export type AnyVoidCB = () => AnyVoid;

export type AnyCB = () => Promise<any> | any;

export type TestCB<T extends any[]> = (...macroArgs: T) => AnyVoid;

export type LogFn = (...args: any[]) => void;

export type Title<T extends any[]> = string | ((...args: Partial<T>) => string);

export interface Hooks {
	beforeAll: AnyVoidCB;
	beforeEach: AnyVoidCB;
	afterAll: AnyVoidCB;
	afterEach: AnyVoidCB;
}

export interface Context {
	passed: number;
	failed: number;
	testRuntime: number;
	errors: [any, string][];
}

// Configuration

export interface DevConfiguration {
	logger: Pick<Console, "log">;
}

export interface Configuration {
	collector?: CollectorConfiguration;
	require?: string[];
	colors?: boolean;
	bubbleHooks?: boolean;
	volume?: number;
	dev?: false | DevConfiguration;
}

export interface CollectorConfiguration {
	use: keyof Collector;
	[key: string]: any;
}

// Collector configuration

export interface SequencerConfiguration extends CollectorConfiguration {
	use: "sequencer";
	sequence: string[];
	ignore?: string[];
}

export interface MatchExtensionsConfiguration extends CollectorConfiguration {
	use: "matchExtensions";
	match: string[];
	root: string;
}

export interface EntryPointConfiguration extends CollectorConfiguration {
	use: "entryPoint";
	root?: string;
}

// Actions

export interface Action {
	type:
		| "it"
		| "describe-start"
		| "describe-end"
		| "doOnce"
		| "setHook"
		| "configure"
		| "file-start"
		| "file-end";
}

export interface ItAction<T extends any[]> extends Action {
	type: "it";
	title: string;
	cb: TestCB<T>;
	args: T;
}

export interface GroupStartAction extends Action {
	type: "describe-start" | "file-start";
	title: string;
	hooks: (() => void)[];
}

export interface DescribeStartAction extends GroupStartAction {
	type: "describe-start";
}

export interface FileStartAction extends GroupStartAction {
	type: "file-start";
}

export interface GroupEndAction extends Action {
	type: "describe-end" | "file-end";
}

export interface DescribeEndAction extends GroupEndAction {
	type: "describe-end";
}

export interface FileEndAction extends GroupEndAction {
	type: "file-end";
}

export interface SetHookAction extends Action {
	type: "setHook";
	cb: AnyVoidCB;
}

export interface DoOnceAction extends Action {
	type: "doOnce";
	cb: AnyCB;
}

export interface ConfigureAction extends Action {
	type: "configure";
	configuration: Partial<Configuration>;
}

// Errors

export class ConfigError extends Error {
	constructor(optionName: string, message: string) {
		super(`Option '${optionName}': ${message}`);
		this.name = "Config Error";
	}
}

export class InputError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "Input Error";
	}
}

// Guards

// Action guards
export const isHookAction = (action: Action): action is SetHookAction => {
	return action.type === "setHook";
};

export const isItAction = <T extends any[]>(
	action: Action
): action is ItAction<T> => {
	return action.type === "it";
};

export const isDescribeStartAction = (
	action: Action
): action is DescribeStartAction => {
	return action.type === "describe-start";
};

export const isDescribeEndAction = (
	action: Action
): action is DescribeEndAction => {
	return action.type === "describe-end";
};

export const isConfigurationAction = (
	action: Action
): action is ConfigureAction => {
	return action.type === "configure";
};

export const isDoOnceAction = (action: Action): action is DoOnceAction => {
	return action.type === "doOnce";
};

export const isFileStartAction = (
	action: Action
): action is FileStartAction => {
	return action.type === "file-start";
};

export const isFileEndAction = (action: Action): action is FileEndAction => {
	return action.type === "file-end";
};

export const isGroupStartAction = (
	action: Action
): action is GroupStartAction => {
	return isFileStartAction(action) || isDescribeStartAction(action);
};

export const isGroupEndAction = (action: Action): action is GroupEndAction => {
	return isFileEndAction(action) || isDescribeEndAction(action);
};

// Collector guards
export const isEntryPointConfig = (
	config: CollectorConfiguration
): config is EntryPointConfiguration => {
	return config.use === "entryPoint";
};

export const isMatchExtensionsConfig = (
	config: CollectorConfiguration
): config is MatchExtensionsConfiguration => {
	return config.use === "matchExtensions";
};

export const isSequencerConfig = (
	config: CollectorConfiguration
): config is SequencerConfiguration => {
	return config.use === "sequencer";
};
