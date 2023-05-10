import type Log from "../types/Log";
import type LogLevels from "../types/LogLevels";

import createLog from "./create-log";

// Preserve original function references
let originalFunctions = {
	log: console.log,
	info: console.info,
	error: console.error,
	warn: console.warn,
	debug: console.debug,
};

const generateLoggerFunction =
	(level: LogLevels, push: (log: Log) => void) =>
	(...args: (string | unknown)[]) => {
		try {
			push(createLog(level)(args));
			originalFunctions[level](...args);
		} catch {}
	};

const overWriteConsoleFunctions = (push: (log: Log) => void) => {
	console.log = generateLoggerFunction("info", push);
	console.info = generateLoggerFunction("info", push);
	console.error = generateLoggerFunction("error", push);
	console.warn = generateLoggerFunction("warn", push);
	console.debug = generateLoggerFunction("debug", push);

	return () => {
		console.log = originalFunctions.log;
		console.info = originalFunctions.info;
		console.error = originalFunctions.error;
		console.warn = originalFunctions.warn;
		console.debug = originalFunctions.debug;
	};
};

export default overWriteConsoleFunctions;
