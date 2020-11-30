import Queue from "./queue";
import { Configuration, EntryPointConfiguration, MatchExtensionsConfiguration, SequencerConfiguration } from "./types";
export default class Runner {
    private queue;
    private config;
    constructor(queue: Queue, config: Configuration);
    private getAllFiles;
    private readDirWithMatcher;
    private getRealPaths;
    entryPoint: (config: EntryPointConfiguration) => void;
    matchExtensions: (config: MatchExtensionsConfiguration) => void;
    sequencer: (config: SequencerConfiguration) => void;
    run: () => void;
}
