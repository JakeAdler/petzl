import { Configuration } from "./types";
export default class Configurer {
    config: Configuration;
    constructor(options?: Configuration);
    private defaultConfiguration;
    private mergeConfigWithDefault;
    private findConfig;
    private validateConfig;
}
