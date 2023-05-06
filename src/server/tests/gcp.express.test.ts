import { expect, it } from "vitest";
import loggingControllerGenerator from "../gcp/express";

import serviceAccount from "./mocks/gcp/service-account.json";

import Response from "./mocks/express/Response";

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
