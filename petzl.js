#!/bin/env node
const path = require("path");
const fs = require("fs");
require("ts-node").register();

const entryPoint = process.argv[2];

if (!entryPoint) {
	console.error("No entry point provided, exiting.");
	process.exit(1);
} else {
	const fullPath = path.resolve(entryPoint);
	if (fs.existsSync(entryPoint)) {
		const allowedExtensions = [".mjs", ".cjs", ".js", ".ts"];

		const fileExtension = path.extname(fullPath);

		if (allowedExtensions.includes(fileExtension)) {
			require(fullPath);
		} else {
			console.error(`Extension ${fileExtension} is not allowed.`);
			console.error(`Allowed file extension: ${allowedExtensions}`);
			process.exit(1);
		}
	} else {
		console.error(`Entry point ${entryPoint} does not exist, exiting.`);
		process.exit(1);
	}
}
