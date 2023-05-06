interface Log {
	user?: {
		uid?: string;
		email?: string;
		displayName?: string;
	};
	uniqueIdentifiers?: Record<string, unknown>;
	logContent: string | { message: string };
	level: "info" | "debug" | "warn" | "error";
	sessionId?: string;
}

export default Log;
