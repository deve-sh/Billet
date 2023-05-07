import type Log from "../types/Log";
import type LogLevels from "../types/LogLevels";

const processArg = (arg: string | unknown) => {
	if (typeof arg === "string") return arg;
	try {
		return JSON.stringify(arg || "undefined");
	} catch {
		return "undefined | non-serializable obj";
	}
};

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

let originalFunctions;

const overWriteConsoleFunctions = (push: (log: Log) => void) => {
    // Preserve original function references
    originalFunctions = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        debug: console.debug
    }

	console.log = function (...args: (string | unknown)[]) {
		push(createLog("info")(args));
        originalFunctions.log(...args);
	};
	console.error = function (...args: (string | unknown)[]) {
		push(createLog("error")(args));
        originalFunctions.error(...args);
	};
	console.warn = function (...args: (string | unknown)[]) {
		push(createLog("warn")(args));
        originalFunctions.warn(...args);
	};
    console.debug = function (...args: (string | unknown)[]) {
		push(createLog("debug")(args));
        originalFunctions.debug(...args);
	};
};

export default overWriteConsoleFunctions;
