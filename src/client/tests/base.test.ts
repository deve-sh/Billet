import { it, expect } from "vitest";

import billet from "../index";

it("should throw an error if endpoint is not passed", () => {
	expect(() => billet.init()).toThrow(/billet: Endpoint is required to send logs/i);
});
