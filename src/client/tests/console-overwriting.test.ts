import { it, expect, describe, afterAll, test, beforeAll, vi } from "vitest";
import FLog from "../index";
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

		FLog.init({
			endpoint: "https://mock-endpoint",
			interceptNativeConsoleLogs: true,
		});
	});

	afterAll(() => {
		FLog.destroy();
		globalThis.setInterval = originalIntervalFunction;
	});

	it("should overwrite console functions and properly invoke them", async () => {
		console.log("Info Log from F-Log");
		console.info("Info Log from F-Log");
		console.error("Error Log from F-Log");
		console.debug("Debug Log from F-Log");
		console.warn("Warning Log from F-Log");
		// @ts-expect-error
		const logsQueue = FLog.logs;
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
