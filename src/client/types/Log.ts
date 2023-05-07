interface Log {
	logContent: string | { message: string };
	level: "info" | "debug" | "warn" | "error";
    createdAt: string;
}

export default Log;
