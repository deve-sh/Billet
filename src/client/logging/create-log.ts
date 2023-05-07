import type Log from "../types/Log";
import type LogLevels from "../types/LogLevels";

import processArg from "./process-log-arg";

const createLog =
	(level: LogLevels) =>
	(args: (string | unknown)[]): Log => {
		let logContent;
		if (args.length === 1) {
			logContent = { message: processArg(args[0]) };
		} else logContent = { messages: args.map(processArg) };

		return {
			level,
			logContent,
			createdAt: new Date().toISOString(),
		};
	};

export default createLog;
