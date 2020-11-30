"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ts_node_1 = require("ts-node");
var types_1 = require("./types");
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
        this.readDirWithMatcher = function (dir, matchers) {
            var allFiles = _this.getAllFiles(dir);
            return allFiles.filter(function (fileName) {
                for (var _i = 0, matchers_1 = matchers; _i < matchers_1.length; _i++) {
                    var extension = matchers_1[_i];
                    if (fileName.endsWith(extension)) {
                        return fileName;
                    }
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
        this.entryPoint = function (config) {
            var fileArg = process.argv[2];
            if (fileArg) {
                fs_1.default.realpath(fileArg, function (err, realPath) {
                    if (err) {
                        throw new Error(fileArg + " is not a valid path");
                    }
                    else {
                        require(realPath);
                        _this.queue.run();
                    }
                });
            }
            else {
                throw new Error("Must provide entry point as command line argument for the entryPoint runner");
            }
        };
        this.matchExtensions = function (config) {
            var match = config.match, root = config.root;
            var allPaths = _this.readDirWithMatcher(root, match);
            var realPaths = _this.getRealPaths(allPaths);
            for (var _i = 0, realPaths_1 = realPaths; _i < realPaths_1.length; _i++) {
                var file = realPaths_1[_i];
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
            for (var _c = 0, realPaths_2 = realPaths; _c < realPaths_2.length; _c++) {
                var file = realPaths_2[_c];
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
    }
    return Runner;
}());
exports.default = Runner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3J1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDBDQUFvQjtBQUNwQiw4Q0FBd0I7QUFDeEIsbUNBQW1DO0FBQ25DLGlDQVFpQjtBQUNqQixrQkFBUSxDQUFDO0lBQ1IsS0FBSyxFQUFFLElBQUk7Q0FDWCxDQUFDLENBQUM7QUFFSDtJQUlDLGdCQUFZLEtBQVksRUFBRSxNQUFxQjtRQUEvQyxpQkFHQztRQUNPLGdCQUFXLEdBQUcsVUFBQyxPQUFlLEVBQUUsWUFBdUI7WUFDOUQsSUFBTSxLQUFLLEdBQUcsWUFBRSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QyxZQUFZLEdBQUcsWUFBWSxJQUFJLEVBQUUsQ0FBQztZQUVsQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsSUFBSTtnQkFDbEIsSUFBSSxZQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7b0JBQ3BELFlBQVksR0FBRyxLQUFJLENBQUMsV0FBVyxDQUM5QixPQUFPLEdBQUcsR0FBRyxHQUFHLElBQUksRUFDcEIsWUFBWSxDQUNaLENBQUM7aUJBQ0Y7cUJBQU07b0JBQ04sWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztpQkFDakQ7WUFDRixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sWUFBWSxDQUFDO1FBQ3JCLENBQUMsQ0FBQztRQUVNLHVCQUFrQixHQUFHLFVBQUMsR0FBVyxFQUFFLFFBQW1CO1lBQzdELElBQU0sUUFBUSxHQUFHLEtBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsUUFBUTtnQkFDL0IsS0FBd0IsVUFBUSxF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QyxFQUFFO2dCQUM1QyxLQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzlCO2lCQUFNLElBQUkseUJBQWlCLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzNDLEtBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDN0I7aUJBQU07Z0JBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QscUJBQXFCO1FBQ3RCLENBQUMsQ0FBQztRQWhJRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBK0hGLGFBQUM7QUFBRCxDQUFDLEFBdElELElBc0lDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1ZXVlIGZyb20gXCIuL3F1ZXVlXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVnaXN0ZXIgfSBmcm9tIFwidHMtbm9kZVwiO1xuaW1wb3J0IHtcblx0Q29uZmlndXJhdGlvbixcblx0RW50cnlQb2ludENvbmZpZ3VyYXRpb24sXG5cdE1hdGNoRXh0ZW5zaW9uc0NvbmZpZ3VyYXRpb24sXG5cdGlzTWF0Y2hFeHRlbnNpb25zQ29uZmlnLFxuXHRpc0VudHJ5UG9pbnRDb25maWcsXG5cdGlzU2VxdWVuY2VyQ29uZmlnLFxuXHRTZXF1ZW5jZXJDb25maWd1cmF0aW9uLFxufSBmcm9tIFwiLi90eXBlc1wiO1xucmVnaXN0ZXIoe1xuXHRmaWxlczogdHJ1ZSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSdW5uZXIge1xuXHRwcml2YXRlIHF1ZXVlOiBRdWV1ZTtcblx0cHJpdmF0ZSBjb25maWc6IENvbmZpZ3VyYXRpb247XG5cblx0Y29uc3RydWN0b3IocXVldWU6IFF1ZXVlLCBjb25maWc6IENvbmZpZ3VyYXRpb24pIHtcblx0XHR0aGlzLnF1ZXVlID0gcXVldWU7XG5cdFx0dGhpcy5jb25maWcgPSBjb25maWc7XG5cdH1cblx0cHJpdmF0ZSBnZXRBbGxGaWxlcyA9IChkaXJQYXRoOiBzdHJpbmcsIGFycmF5T2ZGaWxlcz86IHN0cmluZ1tdKSA9PiB7XG5cdFx0Y29uc3QgZmlsZXMgPSBmcy5yZWFkZGlyU3luYyhkaXJQYXRoKTtcblxuXHRcdGFycmF5T2ZGaWxlcyA9IGFycmF5T2ZGaWxlcyB8fCBbXTtcblxuXHRcdGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcblx0XHRcdGlmIChmcy5zdGF0U3luYyhkaXJQYXRoICsgXCIvXCIgKyBmaWxlKS5pc0RpcmVjdG9yeSgpKSB7XG5cdFx0XHRcdGFycmF5T2ZGaWxlcyA9IHRoaXMuZ2V0QWxsRmlsZXMoXG5cdFx0XHRcdFx0ZGlyUGF0aCArIFwiL1wiICsgZmlsZSxcblx0XHRcdFx0XHRhcnJheU9mRmlsZXNcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGFycmF5T2ZGaWxlcy5wdXNoKHBhdGguam9pbihkaXJQYXRoLCBcIi9cIiwgZmlsZSkpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFycmF5T2ZGaWxlcztcblx0fTtcblxuXHRwcml2YXRlIHJlYWREaXJXaXRoTWF0Y2hlciA9IChkaXI6IHN0cmluZywgbWF0Y2hlcnM/OiBzdHJpbmdbXSkgPT4ge1xuXHRcdGNvbnN0IGFsbEZpbGVzID0gdGhpcy5nZXRBbGxGaWxlcyhkaXIpO1xuXHRcdHJldHVybiBhbGxGaWxlcy5maWx0ZXIoKGZpbGVOYW1lKSA9PiB7XG5cdFx0XHRmb3IgKGNvbnN0IGV4dGVuc2lvbiBvZiBtYXRjaGVycykge1xuXHRcdFx0XHRpZiAoZmlsZU5hbWUuZW5kc1dpdGgoZXh0ZW5zaW9uKSkge1xuXHRcdFx0XHRcdHJldHVybiBmaWxlTmFtZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXG5cdHByaXZhdGUgZ2V0UmVhbFBhdGhzID0gKGZpbGVzOiBzdHJpbmdbXSkgPT4ge1xuXHRcdHJldHVybiBmaWxlcy5tYXAoKGZpbGUpID0+IHtcblx0XHRcdGNvbnN0IHJlYWxQYXRoID0gZnMucmVhbHBhdGhTeW5jKGZpbGUpO1xuXHRcdFx0aWYgKCFmaWxlKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XHRgQ291bGQgbm90IGNyZWF0ZSBwYXRoIGZvciAke2ZpbGV9LiBDaGVjayBjb25maWd1cmF0aW9uLmBcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiByZWFsUGF0aDtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHRwdWJsaWMgZW50cnlQb2ludCA9IChjb25maWc6IEVudHJ5UG9pbnRDb25maWd1cmF0aW9uKSA9PiB7XG5cdFx0Y29uc3QgZmlsZUFyZyA9IHByb2Nlc3MuYXJndlsyXTtcblx0XHRpZiAoZmlsZUFyZykge1xuXHRcdFx0ZnMucmVhbHBhdGgoZmlsZUFyZywgKGVyciwgcmVhbFBhdGgpID0+IHtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgJHtmaWxlQXJnfSBpcyBub3QgYSB2YWxpZCBwYXRoYCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVxdWlyZShyZWFsUGF0aCk7XG5cdFx0XHRcdFx0dGhpcy5xdWV1ZS5ydW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcblx0XHRcdFx0XCJNdXN0IHByb3ZpZGUgZW50cnkgcG9pbnQgYXMgY29tbWFuZCBsaW5lIGFyZ3VtZW50IGZvciB0aGUgZW50cnlQb2ludCBydW5uZXJcIlxuXHRcdFx0KTtcblx0XHR9XG5cdH07XG5cblx0cHVibGljIG1hdGNoRXh0ZW5zaW9ucyA9IChjb25maWc6IE1hdGNoRXh0ZW5zaW9uc0NvbmZpZ3VyYXRpb24pID0+IHtcblx0XHRjb25zdCB7IG1hdGNoLCByb290IH0gPSBjb25maWc7XG5cdFx0Y29uc3QgYWxsUGF0aHMgPSB0aGlzLnJlYWREaXJXaXRoTWF0Y2hlcihyb290LCBtYXRjaCk7XG5cdFx0Y29uc3QgcmVhbFBhdGhzID0gdGhpcy5nZXRSZWFsUGF0aHMoYWxsUGF0aHMpO1xuXHRcdGZvciAoY29uc3QgZmlsZSBvZiByZWFsUGF0aHMpIHtcblx0XHRcdHJlcXVpcmUoZmlsZSk7XG5cdFx0fVxuXHRcdHRoaXMucXVldWUucnVuKCk7XG5cdH07XG5cblx0cHVibGljIHNlcXVlbmNlciA9IChjb25maWc6IFNlcXVlbmNlckNvbmZpZ3VyYXRpb24pID0+IHtcblx0XHQvKiBjb25zdCBzZXF1ZW5jZSA9IHRoaXMuY29uZmlnLnJ1bm5lci5ydW47ICovXG5cdFx0Y29uc3QgeyBpbmNsdWRlLCBleGNsdWRlIH0gPSBjb25maWc7XG5cblx0XHRsZXQgYWxsU2VxdWVuY2VkRmlsZXM6IHN0cmluZ1tdID0gW107XG5cblx0XHRmb3IgKGNvbnN0IGZpbGVPckRpciBvZiBpbmNsdWRlKSB7XG5cdFx0XHRjb25zdCBpc0RpciA9IGZzLnN0YXRTeW5jKGZpbGVPckRpcikuaXNEaXJlY3RvcnkoKTtcblx0XHRcdGlmIChpc0Rpcikge1xuXHRcdFx0XHRhbGxTZXF1ZW5jZWRGaWxlcy5wdXNoKC4uLnRoaXMuZ2V0QWxsRmlsZXMoZmlsZU9yRGlyKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRhbGxTZXF1ZW5jZWRGaWxlcy5wdXNoKGZpbGVPckRpcik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGV4Y2x1ZGUpIHtcblx0XHRcdGNvbnN0IHNwbGljZUZpbGUgPSAoZmlsZTogc3RyaW5nKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gYWxsU2VxdWVuY2VkRmlsZXMuaW5kZXhPZihmaWxlKTtcblx0XHRcdFx0YWxsU2VxdWVuY2VkRmlsZXMuc3BsaWNlKGluZGV4LCAxKTtcblx0XHRcdH07XG5cdFx0XHRmb3IgKGNvbnN0IGZpbGVPckRpciBvZiBleGNsdWRlKSB7XG5cdFx0XHRcdGNvbnN0IGlzRGlyID0gZnMuc3RhdFN5bmMoZmlsZU9yRGlyKS5pc0RpcmVjdG9yeSgpO1xuXHRcdFx0XHRpZiAoaXNEaXIpIHtcblx0XHRcdFx0XHRjb25zdCBhbGxGaWxlc0luRGlyID0gdGhpcy5nZXRBbGxGaWxlcyhmaWxlT3JEaXIpO1xuXHRcdFx0XHRcdGZvciAoY29uc3QgZmlsZSBvZiBhbGxGaWxlc0luRGlyKSB7XG5cdFx0XHRcdFx0XHRzcGxpY2VGaWxlKGZpbGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzcGxpY2VGaWxlKGZpbGVPckRpcik7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zdCByZWFsUGF0aHMgPSB0aGlzLmdldFJlYWxQYXRocyhhbGxTZXF1ZW5jZWRGaWxlcyk7XG5cblx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgcmVhbFBhdGhzKSB7XG5cdFx0XHRyZXF1aXJlKGZpbGUpO1xuXHRcdH1cblxuXHRcdHRoaXMucXVldWUucnVuKCk7XG5cdH07XG5cblx0cHVibGljIHJ1biA9ICgpID0+IHtcblx0XHRjb25zdCBydW5uZXJDb25maWcgPSB0aGlzLmNvbmZpZy5ydW5uZXI7XG5cdFx0aWYgKGlzTWF0Y2hFeHRlbnNpb25zQ29uZmlnKHJ1bm5lckNvbmZpZykpIHtcblx0XHRcdHRoaXMubWF0Y2hFeHRlbnNpb25zKHJ1bm5lckNvbmZpZyk7XG5cdFx0fSBlbHNlIGlmIChpc0VudHJ5UG9pbnRDb25maWcocnVubmVyQ29uZmlnKSkge1xuXHRcdFx0dGhpcy5lbnRyeVBvaW50KHJ1bm5lckNvbmZpZyk7XG5cdFx0fSBlbHNlIGlmIChpc1NlcXVlbmNlckNvbmZpZyhydW5uZXJDb25maWcpKSB7XG5cdFx0XHR0aGlzLnNlcXVlbmNlcihydW5uZXJDb25maWcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgcmVhZCBydW5uZXIgY29maWd1cmF0aW9uXCIpO1xuXHRcdH1cblx0XHQvKiB0aGlzW3J1bm5lcl0oKTsgKi9cblx0fTtcbn1cbiJdfQ==