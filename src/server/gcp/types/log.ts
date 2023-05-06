interface Log {
	user?: {
		uid?: string;
		email?: string;
		displayName?: string;
	};
	uniqueIdentifiers?: Record<string, unknown>;
	args: string[];
	level: "info" | "debug" | "warn" | "error";
}

export default Log;
