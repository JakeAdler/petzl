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
register({
	files: true,
});

export default class Runner {
	private queue: Queue;
	private config: Configuration;

	constructor(queue: Queue, config: Configuration) {
		this.queue = queue;
		this.config = config;
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

	private readDirWithMatcher = (dir: string, matchers?: string[]) => {
		const allFiles = this.getAllFiles(dir);
		return allFiles.filter((fileName) => {
			for (const extension of matchers) {
				if (fileName.endsWith(extension)) {
					return fileName;
				}
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

	public entryPoint = (config: EntryPointConfiguration) => {
		const fileArg = process.argv[2];
		if (fileArg) {
			fs.realpath(fileArg, (err, realPath) => {
				if (err) {
					throw new Error(`${fileArg} is not a valid path`);
				} else {
					require(realPath);
					this.queue.run();
				}
			});
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
