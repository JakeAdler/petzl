import Runner from "./runner";
import fs from "fs";
import path from "path";
import {
	Configuration,
	EntryPointConfiguration,
	MatchExtensionsConfiguration,
	isMatchExtensionsConfig,
	isEntryPointConfig,
	isSequencerConfig,
	SequencerConfiguration,
} from "./types";
import Logger from "./logger";
import Configurer from "./configurer";

export default class Collector {
	private queue: Runner;
	private config: Configuration;
	private logger: Logger;

	constructor(queue: Runner, configurer: Configurer) {
		this.queue = queue;
		this.config = configurer.config;
		this.logger = new Logger(configurer.config);
	}

	private getAllFiles = (dirPath: string, arrayOfFiles?: string[]) => {
		const files = fs.readdirSync(dirPath);

		arrayOfFiles = arrayOfFiles || [];

		files.forEach((file) => {
			if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				arrayOfFiles = this.getAllFiles(
					dirPath + "/" + file,
					arrayOfFiles
				);
			} else {
				arrayOfFiles.push(path.join(dirPath, "/", file));
			}
		});

		return arrayOfFiles;
	};

	private joinPathAndRoot = (input: string, root?: string) => {
		if (root) {
			return path.join(root, input);
		} else {
			return input;
		}
	};

	private readDirWithMatcher = (dir: string, matchers?: string[]) => {
		const allFiles = this.getAllFiles(dir);
		return allFiles.filter((fileName) => {
			if (matchers) {
				for (const extension of matchers) {
					if (fileName.endsWith(extension)) {
						return fileName;
					}
				}
			} else {
				return fileName;
			}
		});
	};

	private getRealPaths = (paths: string[]) => {
		return paths.map((file) => {
			const realPath = fs.realpathSync(file);
			if (!file) {
				throw new Error(
					`Could not create path for ${file}. Check configuration.`
				);
			} else {
				return realPath;
			}
		});
	};

	private runList = async (paths: string[]) => {
		const realPaths = this.getRealPaths(paths);
		for (const file of realPaths) {
			this.queue.pushAction({
				type: "doOnce",
				cb: () => {
					this.logger.logTestFileName(file);
				},
			});
			await import(file);
		}
		this.queue.run();
	};

	public entryPoint = async (config: EntryPointConfiguration) => {
		const { root } = config;
		const cliInput = process.argv[2];

		if (!cliInput) {
			if (root) {
				const allFiles = this.getAllFiles(root);
				this.runList(allFiles);
				return;
			} else {
				throw new Error(
					"Must provide 'runner.root' option in config file, or path to file or directory as command line argument "
				);
			}
		}

		const baseDir = cliInput.split("/")[0];
		const userPath =
			baseDir === root ? cliInput : this.joinPathAndRoot(cliInput, root);
		let isDir: boolean;
		let isFile: boolean;
		try {
			const fileArgStat = fs.statSync(userPath);
			isDir = fileArgStat.isDirectory();
			isFile = fileArgStat.isFile();
		} catch {}
		if (isFile) {
			// Run file
			this.logger.logFileOrDirname("file", userPath);
			const filePath = fs.realpathSync(userPath);
			this.runList([filePath]);
		} else if (isDir) {
			// Run directory
			this.logger.logFileOrDirname("directory", userPath);
			const allFilesInDir = this.getAllFiles(userPath);
			this.runList(allFilesInDir);
		} else if (root) {
			const allFiles = this.getAllFiles(root);

			const chars = userPath.split("");

			const regexStr = chars.reduce((prev, acc, i) => {
				if (i === chars.length - 1) {
					prev += acc;
				} else {
					prev += `${acc}.*`;
				}
				return prev;
			}, "");

			const regex = new RegExp(regexStr);

			const matchingFiles = allFiles.filter((fileName) => {
				const matches = fileName.match(regex);
				if (matches && matches.length) {
					return fileName;
				}
			});

			await this.runList(matchingFiles);
		}
	};

	public matchExtensions = async (config: MatchExtensionsConfiguration) => {
		const { match, root } = config;
		const allPaths = this.readDirWithMatcher(root, match);
		await this.runList(allPaths);
	};

	public sequencer = async (config: SequencerConfiguration) => {
		const { sequence, ignore } = config;

		let allSequencedFiles: string[] = [];

		for (const fileOrDir of sequence) {
			const isDir = fs.statSync(fileOrDir).isDirectory();
			if (isDir) {
				allSequencedFiles.push(...this.getAllFiles(fileOrDir));
			} else {
				allSequencedFiles.push(fileOrDir);
			}
		}

		if (ignore) {
			const spliceFile = (file: string) => {
				const index = allSequencedFiles.indexOf(file);
				allSequencedFiles.splice(index, 1);
			};
			for (const fileOrDir of ignore) {
				const isDir = fs.statSync(fileOrDir).isDirectory();
				if (isDir) {
					const allFilesInDir = this.getAllFiles(fileOrDir);
					for (const file of allFilesInDir) {
						spliceFile(file);
					}
				} else {
					spliceFile(fileOrDir);
				}
			}
		}

		await this.runList(allSequencedFiles);
	};

	public collect = async () => {
		const collectorConfig = this.config.collector;
		if (isMatchExtensionsConfig(collectorConfig)) {
			this.matchExtensions(collectorConfig);
		} else if (isEntryPointConfig(collectorConfig)) {
			this.entryPoint(collectorConfig);
		} else if (isSequencerConfig(collectorConfig)) {
			this.sequencer(collectorConfig);
		} else {
			throw new Error("Cannot read runner cofiguration");
		}
	};
}
