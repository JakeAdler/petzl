module.exports = {
	// volume: 3,
	require: ["ts-node/register"],
	printFileNames: false,
	collector: {
		use: "entryPoint",
		root: "test",
	},
};
