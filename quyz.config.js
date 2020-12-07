module.exports = {
	volume: 3,
	require: ["ts-node/register"],
	collector: {
		use: "entryPoint",
		root: "test",
	},
};
