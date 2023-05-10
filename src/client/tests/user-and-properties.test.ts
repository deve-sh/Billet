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

const userDetails = {
	uid: "uuid",
	displayName: "User Name",
	email: "user@email.com",
};

describe("User and properties tests", () => {
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
			interceptNativeConsoleLogs: false,
		});

		FLog.setUser(userDetails);
		FLog.setProperty("property-name", "property-value");
	});

	afterAll(() => {
		FLog.destroy();
		globalThis.setInterval = originalIntervalFunction;
	});

	it("should expose setUser and setProperty functions", () => {
		expect(() => FLog.setUser).toBeInstanceOf(Function);
		expect(() => FLog.setProperty).toBeInstanceOf(Function);
	});

	test("user and properties data should reflect in the network call made to transport logs", async () => {
		FLog.Logger.log("Hey there");
		await new Promise((resolve) => setTimeout(resolve, 10));
		expect(mockSendFunctionArgs).toBeTruthy();
		expect(mockSendFunctionArgs.events[0].user).toMatchObject(userDetails);
		expect(mockSendFunctionArgs.events[0].properties).toMatchObject({
			"property-name": "property-value",
		});
	});
});
