import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
	{
		test: {
			name: "server libraries tests",
			root: "./src/server/tests",
		},
	},
	{
		test: {
			name: "client libraries tests",
			root: "./src/client/tests",
		},
	},
]);
