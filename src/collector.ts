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

export default class Collector {
	private runner: Runner;
	private config: Configuration;
	private logger: Logger;

	constructor(runner: Runner, configurer: Configurer) {
		this.runner = runner;
		this.config = configurer.config;
		this.logger = new Logger(configurer.config);
	}

	// Recursively get all files in dirPath
	private getAllFiles = (dirPath: string) => {
		const walk = (dir: string, allFiles?: string[]): string[] => {
			allFiles = allFiles || [];
			const dirFiles = fs.readdirSync(dir);

			for (const file of dirFiles) {
				if (fs.statSync(dir + "/" + file).isDirectory()) {
					walk(dir + "/" + file, allFiles);
				} else {
					allFiles.push(path.join(dir, "/", file));
				}
			}

			return allFiles;
		};

		return walk(dirPath);
	};

	private getRealPaths = (paths: string[]) => {
		return paths.map((file) => fs.realpathSync(file));
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
				return this.runList(this.getAllFiles(root));
			}

			throw new InputError(
				"Must provide 'runner.root' option in config file, or the path to a file or directory as a command line argument "
			);
		} else {
			// Check if CLI input is an actual path to a file or dir
			const realPath = fs.realpathSync(cliInput);
			const fileArgStat = fs.statSync(realPath);

			const isDir = fileArgStat.isDirectory();
			const isFile = fileArgStat.isFile();

			if (isFile) {
				const filePath = fs.realpathSync(cliInput);
				this.logger.logCurrentlyRunning("file", cliInput);
				return await this.runList([filePath]);
			} else if (isDir) {
				const allFilesInDir = this.getAllFiles(cliInput);
				this.logger.logCurrentlyRunning("directory", cliInput);
				return await this.runList(allFilesInDir);
			} else if (root) {
				// Regex match CLI input (requires root option to be set)

				// Generate regex string e.g.:
				// input: 'foo' --> 'f.*o.*o.*'
				const regexStr = new RegExp(
					cliInput
						.split("")
						.reduce((prev, acc) => (prev += `${acc}.*`), "")
				);

				const matchingFiles = this.getAllFiles(root).filter((file) => {
					return file
						.replace(root, "")
						.replace(path.extname(file), "")
						.match(regexStr);
				});

				if (matchingFiles) {
					this.logger.logCurrentlyRunning("files matching", cliInput);
					return await this.runList(matchingFiles);
				}

				throw new InputError(
					`No files or directories matching ${cliInput}`
				);
			}

			throw new InputError(
				`Could not find file or directory named ${cliInput}`
			);
		}
	};

	public matchExtensions = async (config: MatchExtensionsConfiguration) => {
		const { match, root } = config;
		const matchingPaths = this.getAllFiles(root).filter((fileName) => {
			return match.every((ext) => fileName.endsWith(ext));
		});

		if (matchingPaths) {
			return await this.runList(matchingPaths);
		}

		throw new InputError(`No files matching extension ${match}`);
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
