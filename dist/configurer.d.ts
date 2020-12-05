import { Configuration } from "./types";
export default class Configurer {
    config: Configuration;
    constructor(options?: Configuration);
    private defaultConfiguration;
    applyConfig: (options: Configuration, onTheFly: boolean) => void;
    private checkRequires;
    private findConfig;
    private validateConfig;
}
