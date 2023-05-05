interface Log {
	user: {
		uid?: string;
		email?: string;
		displayName?: string;
	};
	args: string[];
	level: "info" | "debug" | "warn" | "error";
}

export default Log;