import { Configuration, Title, AnyCB } from "./types";
declare class Petzl {
    private logger;
    private config;
    constructor(configuration?: Configuration);
    private context;
    private pass;
    private fail;
    configure: (options: Partial<Configuration>) => void;
    explode: (message: string) => never;
    private canItBeRun;
    it: <T extends any[]>(title: Title<T>, cb: AnyCB<T>, ...args: T) => void | Promise<void>;
    describe: <T extends any[]>(title: Title<T>, cb: AnyCB<T>, ...args: T) => Promise<void>;
}
export default Petzl;
