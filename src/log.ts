let padding = "";

const log = (...messages: any[]) => {
	if (padding.length) {
		console.log(padding, ...messages);
	} else {
		console.log(...messages);
	}
};

const addPadding = () => {
	padding += "  ";
};

const subtractPadding = () => {
	padding = padding.slice(0, padding.length - 2);
};

export { log, addPadding, subtractPadding };
