import { expect, it } from "vitest";
import loggingControllerGenerator from "../gcp/express";

import serviceAccount from "./mocks/gcp/service-account.json";

import Response from "./mocks/express/Response";
import logs from "./mocks/logs.json";

import { vi } from "vitest";
import Log from "../gcp/types/log";

//#region GCP Logging MOCKS
// Mock storage variables for properties and values sent to the GCP module class
let mockLogsSentToGCPServer: Log[] = [];
let mockConfigSentToLogging: any = {};
let mockLogNameSentToLogging = "";

vi.mock("@google-cloud/logging", () => ({
	Logging: class {
		constructor(config: { projectId: string; credentials: unknown }) {
			mockConfigSentToLogging = config;
		}
		log(logName: string) {
			mockLogNameSentToLogging = logName;
			return {
				entry: (metadata, log) => ({ metadata, log }),
				write: (log: Log) => new Promise(() => {
					mockLogsSentToGCPServer.push(log);
				}),
			};
		}
	},
}));
//#endregion

const loggingController = loggingControllerGenerator({
	serviceAccount,
	serviceName: "frontend",
	logName: "frontend-logs",
});

it("should return 400 status if logs are not passed", () => {
	const response = new Response();
	// @ts-expect-error
	loggingController({ body: {} }, response);
	expect(response.status).toBe(400);
});

it("should write to GCP Logs when data is as expected", () => {
	const response = new Response();
	// @ts-expect-error
	loggingController({ body: { logs } }, response);

	// Should have initialized GCP logger with projectId and credentials from the serviceAccount
	expect(mockConfigSentToLogging).toHaveProperty("projectId");
	expect(mockConfigSentToLogging).toHaveProperty(
		"credentials"
	);
	expect(mockConfigSentToLogging.projectId).toBe(
		serviceAccount.project_id
	);
	expect(mockConfigSentToLogging.credentials.private_key).toBe(
		serviceAccount.private_key
	);

	// Should have set the right logName
	expect(mockLogNameSentToLogging).toBe("frontend-logs");

	// Should have invoked the logger with the list of logs
	expect(mockLogsSentToGCPServer).toHaveLength(logs.length);

	// Should send back 200 status code
	expect(response.status).toBe(200);
});
