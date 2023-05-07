import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "server libraries tests",
		root: "./src/server/tests",
	},
});
