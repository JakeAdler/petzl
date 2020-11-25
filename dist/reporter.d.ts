import { Configuration, Context } from "./types";
import Logger from "./logger";
declare const summarize: (logger: Logger, context: Context, configuration: Configuration) => void;
export default summarize;
