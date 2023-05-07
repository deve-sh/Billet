import { it, expect } from "vitest";

import FLog from "../index";

it("should throw an error if endpoint is not passed", () => {
	expect(() => FLog.init()).toThrow(/FLog: Endpoint is required to send logs/);
});
