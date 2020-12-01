import Queue from "./queue";
import { Configuration, EntryPointConfiguration, MatchExtensionsConfiguration, SequencerConfiguration } from "./types";
export default class Runner {
    private queue;
    private config;
    private logger;
    constructor(queue: Queue, config: Configuration);
    private getAllFiles;
    private joinPathAndRoot;
    private readDirWithMatcher;
    private getRealPaths;
    private runList;
    entryPoint: (config: EntryPointConfiguration) => void;
    matchExtensions: (config: MatchExtensionsConfiguration) => void;
    sequencer: (config: SequencerConfiguration) => void;
    run: () => void;
}
