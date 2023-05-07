interface Log {
	user?: {
		uid?: string;
		email?: string;
		displayName?: string;
	};
	properties?: Record<string, unknown>;
	logContent: string | { message?: string; messages?: string };
	level: "info" | "debug" | "warn" | "error";
	sessionId?: string;
	createdAt: string;
}

export default Log;
