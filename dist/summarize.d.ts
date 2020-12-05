import { Action, Configuration, Context } from "./types";
import Logger from "./logger";
export default class Summarizer {
    logger: Logger;
    config: Configuration;
    constructor(logger: Logger, configuration: Configuration);
    logContext: (context: Context) => void;
    updateSummary: (context: Context, queue: Action[]) => void;
    clearSummary: () => void;
    endReport: (context: Context) => void;
}
