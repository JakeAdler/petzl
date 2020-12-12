module.exports = {
	require: ["ts-node/register"],
	bubbleHooks: true,
	printFileNames: false,
	collector: {
		use: "entryPoint",
		root: "test",
	},
};
