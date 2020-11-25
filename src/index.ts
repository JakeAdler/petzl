import Petzl from "./petzl";
import summarize from "./summarize";

export default Petzl;

const { it, describe, configure, explode } = new Petzl();

export { it, describe, configure, explode, summarize };
