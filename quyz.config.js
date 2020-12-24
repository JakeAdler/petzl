module.exports = {
	require: ["ts-node/register"],
	bubbleHooks: true,
	printFileNames: false,
	collector: {
		root: "test",
		ignore: "test/utils",
	},
};
