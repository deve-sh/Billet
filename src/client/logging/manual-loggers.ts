import type Log from "../types/Log";
import type LogLevels from "../types/LogLevels";

import createLog from "./create-log";

const generateManualLoggingFunction =
	(level: LogLevels, push: (log: Log) => void) =>
	(...args: (string | unknown)[]) => {
		push(createLog(level)(args));
	};

export default generateManualLoggingFunction;
