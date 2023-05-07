import type Log from "../types/Log";
import createLog from "./create-log";

// Preserve original function references
let originalFunctions = {
	log: console.log,
	error: console.error,
	warn: console.warn,
	debug: console.debug,
};

const overWriteConsoleFunctions = (push: (log: Log) => void) => {
	console.log = (...args: (string | unknown)[]) => {
		push(createLog("info")(args));
		originalFunctions.log(...args);
	};
	console.info = (...args: (string | unknown)[]) => {
		push(createLog("info")(args));
		originalFunctions.log(...args);
	};
	console.error = (...args: (string | unknown)[]) => {
		push(createLog("error")(args));
		originalFunctions.error(...args);
	};
	console.warn = (...args: (string | unknown)[]) => {
		push(createLog("warn")(args));
		originalFunctions.warn(...args);
	};
	console.debug = (...args: (string | unknown)[]) => {
		push(createLog("debug")(args));
		originalFunctions.debug(...args);
	};

	return () => {
		console.log = originalFunctions.log;
		console.error = originalFunctions.error;
		console.warn = originalFunctions.warn;
		console.debug = originalFunctions.debug;
	};
};

export default overWriteConsoleFunctions;
