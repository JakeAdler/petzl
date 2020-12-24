import Runner from "./runner";
import Logger from "./logger";
import Configurer from "./configurer";
import fs from "fs";
import path from "path";
import { Configuration, CollectorConfiguration, InputError } from "./types";

export default class Collector {
	private runner: Runner;
	private config: Configuration;
	private logger: Logger;

	constructor(runner: Runner, configurer: Configurer) {
		this.runner = runner;
		this.config = configurer.config;
		this.logger = new Logger(configurer.config);
	}

	private getStringArr = (
		val: string | string[],
		optionName?: string
	): string[] => {
		let arr: string[];
		if (typeof val === "string") {
			arr = [val];
		} else if (Array.isArray(val)) {
			arr = val;
		} else {
			throw new Error(
				`Expected ${
					optionName && `option '${optionName}'`
				} to be type of string or string[] but got type of ${typeof val}`
			);
		}

		return arr;
	};

	private tryToJoinRoot = (paths: string[], root: string): string[] => {
		return paths.map((file) => {
			if (!file.startsWith(root) || file.startsWith(`/${root}`)) {
				file = path.join(root, file);
			}
			return path.join(process.env["PWD"], file);
		});
	};

	private spliceAndUnshift = (files: string[]) => {
		for (const file of files) {
			const index = this.fileList.indexOf(file);
			this.fileList.splice(index, 1);
			this.fileList.unshift(file);
		}
	};

	private fileList: string[] = [];

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
		return paths.map((p) => fs.realpathSync(p));
	};

	private runFileList = () => {
		const realPaths = this.getRealPaths(this.fileList);
		for (const file of realPaths) {
			this.runner.pushAction({
				type: "file-start",
				title: file,
				hooks: [],
			});

			require(file);

			this.runner.pushAction({
				type: "file-end",
			});
		}
		this.runner.run();
	};

	private getFilesMatchingExtension = (match: string | string[]) => {
		const matchers = this.getStringArr(match);

		const matchingPaths = this.fileList.filter((fileName) => {
			return matchers.some((ext) => fileName.endsWith(ext));
		});

		if (matchingPaths) {
			this.fileList = matchingPaths;
			return;
		}

		throw new InputError(`No files matching extension ${match}`);
	};

	private ignoreFiles = (files: string | string[], root: string) => {
		const ignore = this.tryToJoinRoot(this.getStringArr(files), root);

		for (const ignorePath of ignore) {
			if (!fs.existsSync(ignorePath)) {
				throw new Error(`Path ${ignorePath} does not exist`);
			}
			const index = this.fileList.indexOf(ignorePath);
			this.fileList.splice(index, 1);
		}
	};

	// Regex match CLI input (requires root option to be set)
	// Generate regex string e.g.:
	// input: 'foo' --> 'f.*o.*o.*'
	private matchRegexInput = (input: string, root: string) => {
		const allFiles = this.getAllFiles(root);

		const regexStr = new RegExp(
			input.split("").reduce((prev, acc) => (prev += `${acc}.*`), "")
		);

		const filesMatchingInput = allFiles.filter((file) => {
			return file
				.replace(root, "")
				.replace(path.extname(file), "")
				.match(regexStr);
		});

		if (filesMatchingInput) {
			this.logger.logCurrentlyRunning("files matching", input);
			this.fileList = filesMatchingInput;
			this.runFileList();
		}
	};

	public collect = (input?: string) => {
		const { root, match, ignore } = this.config.collector;

		const cliInput = input || process.argv[2];

		if (!cliInput) {
			// If root option is set and no CLI input, just run root
			if (root) {
				this.fileList = this.getAllFiles(root);

				if (ignore) {
					this.ignoreFiles(ignore, root);
				}

				if (match) {
					this.getFilesMatchingExtension(match);
				}

				return this.runFileList();
			} else {
				throw new InputError(
					"Must provide 'collector.root' option in config file, or the path to a file or directory as a command line argument "
				);
			}
		} else {
			// Check if CLI input is an actual path to a file or dir

			const realPath = fs.realpathSync(cliInput);
			const fileArgStat = fs.statSync(realPath);

			const isDir = fileArgStat.isDirectory();
			const isFile = fileArgStat.isFile();

			if (isFile) {
				const filePath = fs.realpathSync(cliInput);
				this.logger.logCurrentlyRunning("file", cliInput);
				this.fileList = [filePath];
				return this.runFileList();
			} else if (isDir) {
				const allFilesInDir = this.getAllFiles(cliInput);
				this.logger.logCurrentlyRunning("directory", cliInput);
				this.fileList = allFilesInDir;
				return this.runFileList();
			} else if (root) {
				this.matchRegexInput(cliInput, root);
				return this.runFileList();
			} else {
				throw new InputError(
					`Input ${cliInput} is not a path to a file or directory, and the 'collector.root' option is not set, set it to use Regex matching`
				);
			}
		}
	};
}
