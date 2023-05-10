import { it, expect, describe, afterAll, test, beforeAll, vi } from "vitest";
import billet from "../index";
import Log from "../types/Log";

const originalIntervalFunction = globalThis.setInterval;

let mockSendFunctionArgs: any;
vi.mock("../utils/send", () => ({
	default: (endpoint: string, events: Log[]) => {
		mockSendFunctionArgs = { endpoint, events };
	},
}));

describe("Console overwriting tests", () => {
	beforeAll(() => {
		// @ts-expect-error
		globalThis.window = { onbeforeunload: () => null };
		// @ts-expect-error
		globalThis.setInterval = (callback: () => void) =>
			setTimeout(() => {
				callback();
				globalThis.setInterval(callback, 2);
			}, 2);

		billet.init({
			endpoint: "https://mock-endpoint",
			interceptNativeConsoleLogs: true,
		});
	});

	afterAll(() => {
		billet.destroy();
		globalThis.setInterval = originalIntervalFunction;
	});

	it("should overwrite console functions and properly invoke them", async () => {
		console.log("Info Log from Billet");
		console.info("Info Log from Billet");
		console.error("Error Log from Billet");
		console.debug("Debug Log from Billet");
		console.warn("Warning Log from Billet");
		// @ts-expect-error
		const logsQueue = billet.logs;
		expect(logsQueue).toHaveLength(5);
		await new Promise((resolve) => setTimeout(resolve, 10));
		expect(mockSendFunctionArgs).toBeTruthy();
		let i = 0;
		for (let level of ["info", "info", "error", "debug", "warn"]) {
			expect(mockSendFunctionArgs.events[i].level).toEqual(level);
			expect(mockSendFunctionArgs.events[i].logContent).toHaveProperty(
				"message"
			);
			expect(mockSendFunctionArgs.events[i].createdAt).toBeTypeOf('string');
			expect(new Date(mockSendFunctionArgs.events[i].createdAt)).not.toMatch(
				/invalid date/i
			);
			i++;
		}
	});
});
