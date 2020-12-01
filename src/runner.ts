import Queue from "./queue";
import fs from "fs";
import path from "path";
import { register } from "ts-node";
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
register({
	files: true,
});

export default class Runner {
	private queue: Queue;
	private config: Configuration;
	private logger: Logger;

	constructor(queue: Queue, config: Configuration) {
		this.queue = queue;
		this.config = config;
		this.logger = new Logger(config);
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

	private getRealPaths = (files: string[]) => {
		return files.map((file) => {
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

	private runList = (paths: string[]) => {
		for (const file of paths) {
			require(file);
		}
		this.queue.run();
	};

	public entryPoint = (config: EntryPointConfiguration) => {
		const { root } = config;
		const cliInput = process.argv[2];
		const pathWithRoot = this.joinPathAndRoot(cliInput, root);
		if (cliInput) {
			let isDir: boolean;
			let isFile: boolean;
			try {
				const fileArgStat = fs.statSync(pathWithRoot);
				isDir = fileArgStat.isDirectory();
				isFile = fileArgStat.isFile();
			} catch {}
			if (isFile) {
				// Run file
				const filePath = fs.realpathSync(pathWithRoot);
				const realPath = this.getRealPaths([filePath]);
				this.runList(realPath);
			} else if (isDir) {
				// Run directory
				const allFilesInDir = this.getAllFiles(pathWithRoot);
				const realPaths = this.getRealPaths(allFilesInDir);
				this.runList(realPaths);
			} else if (root) {
				// Match regex

				const chars = cliInput.split("");
				const regexStr = chars.reduce((prev, acc, i) => {
					if (i === chars.length - 1) {
						prev += acc;
					} else {
						prev += `${acc}.*`;
					}
					return prev;
				}, "");

				const regex = new RegExp(regexStr);

				const allFiles = this.getAllFiles(root);

				const matchingFiles = allFiles.filter((fileName) => {
					const matches = fileName.match(regex);
					if (matches && matches.length) {
						return fileName;
					}
				});

				const realPaths = this.getRealPaths(matchingFiles);

				for (const file of realPaths) {
					this.queue.pushAction({
						type: "doOnce",
						cb: () => {
							this.logger.logTestFileName(file);
						},
					});
					require(file);
				}

				this.queue.run();
			}
		} else {
			throw new Error(
				"Must provide entry point as command line argument for the entryPoint runner"
			);
		}
	};

	public matchExtensions = (config: MatchExtensionsConfiguration) => {
		const { match, root } = config;
		const allPaths = this.readDirWithMatcher(root, match);
		const realPaths = this.getRealPaths(allPaths);
		for (const file of realPaths) {
			this.logger.logTestFileName(file);
			require(file);
		}
		this.queue.run();
	};

	public sequencer = (config: SequencerConfiguration) => {
		/* const sequence = this.config.runner.run; */
		const { include, exclude } = config;

		let allSequencedFiles: string[] = [];

		for (const fileOrDir of include) {
			const isDir = fs.statSync(fileOrDir).isDirectory();
			if (isDir) {
				allSequencedFiles.push(...this.getAllFiles(fileOrDir));
			} else {
				allSequencedFiles.push(fileOrDir);
			}
		}

		if (exclude) {
			const spliceFile = (file: string) => {
				const index = allSequencedFiles.indexOf(file);
				allSequencedFiles.splice(index, 1);
			};
			for (const fileOrDir of exclude) {
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

		const realPaths = this.getRealPaths(allSequencedFiles);

		for (const file of realPaths) {
			require(file);
		}

		this.queue.run();
	};

	public run = () => {
		const runnerConfig = this.config.runner;
		if (isMatchExtensionsConfig(runnerConfig)) {
			this.matchExtensions(runnerConfig);
		} else if (isEntryPointConfig(runnerConfig)) {
			this.entryPoint(runnerConfig);
		} else if (isSequencerConfig(runnerConfig)) {
			this.sequencer(runnerConfig);
		} else {
			throw new Error("Cannot read runner cofiguration");
		}
		/* this[runner](); */
	};
}
