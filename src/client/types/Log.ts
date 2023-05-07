import type LogLevels from "./LogLevels";

interface Log {
	logContent: string | { message?: string; messages?: string[] };
	level: LogLevels;
    createdAt: string;
}

export default Log;
