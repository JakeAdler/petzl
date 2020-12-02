module.exports = {
	volume: 3,
	runner: {
		use: "matchExtensions",
		root: "test",
		match: [".ts"],
		// include: ["test/test.ts", "test/nested/"],
	},
};
