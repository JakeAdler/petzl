module.exports = {
	// volume: 3,
	require: ["ts-node/register"],
	bubbleHooks: true,
	collector: {
		use: "entryPoint",
		root: "test",
	},
};
