import { Configuration } from "./types";
export default class Configurer {
    config: Configuration;
    constructor(options?: Configuration);
    private defaultConfiguration;
    private findConfig;
    applyConfig: (options: Configuration, onTheFly: boolean) => void;
    private requireRequires;
    validateConfig: (config: Partial<Configuration>, onTheFly: boolean) => void;
}
