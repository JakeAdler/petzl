import Runner from "./runner";
import Logger from "./logger";
import Configurer from "./configurer";
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
	InputError,
} from "./types";
import { registerProcessEventListeners } from "./utils";

export default class Collector {
	private runner: Runner;
	private config: Configuration;
	private logger: Logger;

	constructor(runner: Runner, configurer: Configurer) {
		this.runner = runner;
		this.config = configurer.config;
		this.logger = new Logger(configurer.config);
		registerProcessEventListeners(this.logger);
	}

	// Recursively get all files in dirPath
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
			this.runner.pushAction({
				type: "file-start",
				title: file,
				hooks: [],
			});

			await import(file);

			this.runner.pushAction({
				type: "file-end",
			});
		}
		await this.runner.run();
	};

	//Collectors
	//entryPoint
	public entryPoint = async (config: EntryPointConfiguration) => {
		const { root } = config;

		const cliInput = process.argv[2];
		if (!cliInput) {
			// If root option is set and no CLI input, just run root
			if (root) {
				const allFiles = this.getAllFiles(root);
				this.runList(allFiles);
				return;
			} else {
				throw new InputError(
					"Must provide 'runner.root' option in config file, or the path to a file or directory as a command line argument "
				);
			}
		} else {
			let isDir: boolean, isFile: boolean;

			// Check if CLI input is an actual path to a file or dir
			try {
				const fileArgStat = fs.statSync(cliInput);
				isDir = fileArgStat.isDirectory();
				isFile = fileArgStat.isFile();
			} catch {}

			if (isFile) {
				const filePath = fs.realpathSync(cliInput);
				this.logger.logCurrentlyRunning("file", cliInput);
				await this.runList([filePath]);
			} else if (isDir) {
				const allFilesInDir = this.getAllFiles(cliInput);
				this.logger.logCurrentlyRunning("directory", cliInput);
				await this.runList(allFilesInDir);
			} else if (root) {
				// Regex match CLI input (requires root option to be set)
				const allFiles = this.getAllFiles(root);

				const chars = cliInput.split("");

				// Generate regex string e.g.:
				// input: 'foo' --> 'f.*o.*o.*'
				const regexStr = new RegExp(
					chars.reduce((prev, acc, i) => {
						if (i === chars.length - 1) {
							prev += acc;
						} else {
							prev += `${acc}.*`;
						}
						return prev;
					}, "")
				);

				const matchingFiles = allFiles.filter((fileName) => {
					const matches = fileName.match(regexStr);
					if (matches && matches.length) {
						return fileName;
					} else {
						throw new InputError(
							`Found no files or directories matches for ${cliInput}`
						);
					}
				});

				this.logger.logCurrentlyRunning("files matching", cliInput);

				await this.runList(matchingFiles);
			} else {
				throw new InputError(
					`Could not find file or directory named ${cliInput}`
				);
			}
		}
	};

	public matchExtensions = async (config: MatchExtensionsConfiguration) => {
		const { match, root } = config;
		const allFiles = this.getAllFiles(root);
		const matchingPaths = allFiles.filter((fileName) => {
			if (match) {
				for (const extension of match) {
					if (fileName.endsWith(extension)) {
						return fileName;
					}
				}
			} else {
				return fileName;
			}
		});

		await this.runList(matchingPaths);
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

	public devCollect = async (path: string) => {
		try {
			const realPath = fs.realpathSync(path);
			await this.runList([realPath]);
		} catch (err) {
			throw new InputError(`Path ${path} does not exist.`);
		}
	};

	public collect = async () => {
		const collectorConfig = this.config.collector;
		if (isMatchExtensionsConfig(collectorConfig)) {
			await this.matchExtensions(collectorConfig);
		} else if (isEntryPointConfig(collectorConfig)) {
			await this.entryPoint(collectorConfig);
		} else if (isSequencerConfig(collectorConfig)) {
			await this.sequencer(collectorConfig);
		} else {
			throw new Error("Cannot read runner cofiguration");
		}
	};
}
