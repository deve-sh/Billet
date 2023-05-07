const path = require("path");

module.exports = {
	entry: "./dist/client/index.js",
	output: {
		path: path.resolve(__dirname, "../dist/client"),
		filename: "index.js",
		globalObject: "this",
		library: {
			name: "FLog",
			type: "umd",
			export: "default",
		},
	},
};
