import { Configuration, Context } from "./types";
import Logger from "./logger";
export default class Summarizer {
    logger: Logger;
    constructor(logger: Logger, configuration: Configuration);
    createTable: (context: Context) => string;
    updateSummary: (context: Context) => void;
    clearSummary: () => void;
    endReport: (context: Context) => void;
}
