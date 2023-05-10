import { it, expect, test, vi, beforeEach, afterEach, describe, afterAll } from "vitest";
import FLog from "../index";

// @ts-expect-error
globalThis.window = { onbeforeunload: () => null };

FLog.init({
	endpoint: "https://mock-endpoint",
	interceptNativeConsoleLogs: false,
});

describe("Manual logger tests", () => {
	afterAll(() => {
		FLog.destroy();
	});
	
	it("should expose manual logging functions", () => {
		expect(() => FLog.Logger).toBeInstanceOf(Object);
		expect(() => FLog.Logger.log).toBeInstanceOf(Function);
		expect(() => FLog.Logger.info).toBeInstanceOf(Function);
		expect(() => FLog.Logger.debug).toBeInstanceOf(Function);
		expect(() => FLog.Logger.error).toBeInstanceOf(Function);
	});

	test("manual logging functions should add to logging queue which should invoke the fetcher at specific intervals", () => {
		FLog.Logger.log("Hey there");
		FLog.Logger.error("Error message", "with more fragments", "here", { a: 1 });
		// @ts-expect-error
		const logsQueue = FLog.logs;
		expect(logsQueue).toHaveLength(2);
	});

	test("shape of data stored in the logs queue", () => {
		// @ts-expect-error
		const logsQueue = FLog.logs;

		// For linear string logs
		expect(logsQueue[0].level).toBe("info");
		expect(logsQueue[0].logContent["message"]).toBe("Hey there");
		expect(logsQueue[0].createdAt).toBeTruthy();

		// For the complex logs
		expect(logsQueue[1].level).toBe("error");
		expect(logsQueue[1].logContent["messages"]).toBeInstanceOf(Array);
		expect(logsQueue[1].logContent["messages"].pop()).toBe('{"a":1}'); // Should work with objects
	});
});
