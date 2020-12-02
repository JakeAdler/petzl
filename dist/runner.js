"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ts_node_1 = require("ts-node");
var types_1 = require("./types");
var logger_1 = __importDefault(require("./logger"));
ts_node_1.register({
    files: true,
});
var Runner = /** @class */ (function () {
    function Runner(queue, config) {
        var _this = this;
        this.getAllFiles = function (dirPath, arrayOfFiles) {
            var files = fs_1.default.readdirSync(dirPath);
            arrayOfFiles = arrayOfFiles || [];
            files.forEach(function (file) {
                if (fs_1.default.statSync(dirPath + "/" + file).isDirectory()) {
                    arrayOfFiles = _this.getAllFiles(dirPath + "/" + file, arrayOfFiles);
                }
                else {
                    arrayOfFiles.push(path_1.default.join(dirPath, "/", file));
                }
            });
            return arrayOfFiles;
        };
        this.joinPathAndRoot = function (input, root) {
            if (root) {
                return path_1.default.join(root, input);
            }
            else {
                return input;
            }
        };
        this.readDirWithMatcher = function (dir, matchers) {
            var allFiles = _this.getAllFiles(dir);
            return allFiles.filter(function (fileName) {
                if (matchers) {
                    for (var _i = 0, matchers_1 = matchers; _i < matchers_1.length; _i++) {
                        var extension = matchers_1[_i];
                        if (fileName.endsWith(extension)) {
                            return fileName;
                        }
                    }
                }
                else {
                    return fileName;
                }
            });
        };
        this.getRealPaths = function (files) {
            return files.map(function (file) {
                var realPath = fs_1.default.realpathSync(file);
                if (!file) {
                    throw new Error("Could not create path for " + file + ". Check configuration.");
                }
                else {
                    return realPath;
                }
            });
        };
        this.runList = function (paths) {
            global.console.log = function (message) {
                console.log.apply(console, __spreadArrays(["*"], message));
            };
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var file = paths_1[_i];
                require(file);
            }
            _this.queue.run();
        };
        this.entryPoint = function (config) {
            var root = config.root;
            var cliInput = process.argv[2];
            var pathWithRoot = _this.joinPathAndRoot(cliInput, root);
            if (cliInput) {
                var isDir = void 0;
                var isFile = void 0;
                try {
                    var fileArgStat = fs_1.default.statSync(pathWithRoot);
                    isDir = fileArgStat.isDirectory();
                    isFile = fileArgStat.isFile();
                }
                catch (_a) { }
                if (isFile) {
                    // Run file
                    var filePath = fs_1.default.realpathSync(pathWithRoot);
                    var realPath = _this.getRealPaths([filePath]);
                    _this.runList(realPath);
                }
                else if (isDir) {
                    // Run directory
                    var allFilesInDir = _this.getAllFiles(pathWithRoot);
                    var realPaths = _this.getRealPaths(allFilesInDir);
                    _this.runList(realPaths);
                }
                else if (root) {
                    // Match regex
                    var chars_1 = cliInput.split("");
                    var regexStr = chars_1.reduce(function (prev, acc, i) {
                        if (i === chars_1.length - 1) {
                            prev += acc;
                        }
                        else {
                            prev += acc + ".*";
                        }
                        return prev;
                    }, "");
                    var regex_1 = new RegExp(regexStr);
                    var allFiles = _this.getAllFiles(root);
                    var matchingFiles = allFiles.filter(function (fileName) {
                        var matches = fileName.match(regex_1);
                        if (matches && matches.length) {
                            return fileName;
                        }
                    });
                    var realPaths = _this.getRealPaths(matchingFiles);
                    var _loop_1 = function (file) {
                        _this.queue.pushAction({
                            type: "doOnce",
                            cb: function () {
                                _this.logger.logTestFileName(file);
                            },
                        });
                        require(file);
                    };
                    for (var _i = 0, realPaths_1 = realPaths; _i < realPaths_1.length; _i++) {
                        var file = realPaths_1[_i];
                        _loop_1(file);
                    }
                    _this.queue.run();
                }
            }
            else {
                throw new Error("Must provide entry point as command line argument for the entryPoint runner");
            }
        };
        this.matchExtensions = function (config) {
            var match = config.match, root = config.root;
            var allPaths = _this.readDirWithMatcher(root, match);
            var realPaths = _this.getRealPaths(allPaths);
            for (var _i = 0, realPaths_2 = realPaths; _i < realPaths_2.length; _i++) {
                var file = realPaths_2[_i];
                _this.logger.logTestFileName(file);
                require(file);
            }
            _this.queue.run();
        };
        this.sequencer = function (config) {
            /* const sequence = this.config.runner.run; */
            var include = config.include, exclude = config.exclude;
            var allSequencedFiles = [];
            for (var _i = 0, include_1 = include; _i < include_1.length; _i++) {
                var fileOrDir = include_1[_i];
                var isDir = fs_1.default.statSync(fileOrDir).isDirectory();
                if (isDir) {
                    allSequencedFiles.push.apply(allSequencedFiles, _this.getAllFiles(fileOrDir));
                }
                else {
                    allSequencedFiles.push(fileOrDir);
                }
            }
            if (exclude) {
                var spliceFile = function (file) {
                    var index = allSequencedFiles.indexOf(file);
                    allSequencedFiles.splice(index, 1);
                };
                for (var _a = 0, exclude_1 = exclude; _a < exclude_1.length; _a++) {
                    var fileOrDir = exclude_1[_a];
                    var isDir = fs_1.default.statSync(fileOrDir).isDirectory();
                    if (isDir) {
                        var allFilesInDir = _this.getAllFiles(fileOrDir);
                        for (var _b = 0, allFilesInDir_1 = allFilesInDir; _b < allFilesInDir_1.length; _b++) {
                            var file = allFilesInDir_1[_b];
                            spliceFile(file);
                        }
                    }
                    else {
                        spliceFile(fileOrDir);
                    }
                }
            }
            var realPaths = _this.getRealPaths(allSequencedFiles);
            for (var _c = 0, realPaths_3 = realPaths; _c < realPaths_3.length; _c++) {
                var file = realPaths_3[_c];
                require(file);
            }
            _this.queue.run();
        };
        this.run = function () {
            var runnerConfig = _this.config.runner;
            if (types_1.isMatchExtensionsConfig(runnerConfig)) {
                _this.matchExtensions(runnerConfig);
            }
            else if (types_1.isEntryPointConfig(runnerConfig)) {
                _this.entryPoint(runnerConfig);
            }
            else if (types_1.isSequencerConfig(runnerConfig)) {
                _this.sequencer(runnerConfig);
            }
            else {
                throw new Error("Cannot read runner cofiguration");
            }
            /* this[runner](); */
        };
        this.queue = queue;
        this.config = config;
        this.logger = new logger_1.default(config);
    }
    return Runner;
}());
exports.default = Runner;
//# sourceMappingURL=runner.js.map