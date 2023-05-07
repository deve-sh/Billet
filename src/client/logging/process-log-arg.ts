const processArg = (arg: string | unknown) => {
	if (typeof arg === "string") return arg;
	try {
		return JSON.stringify(arg);
	} catch {
		if (arg === "undefined") return "undefined";
		return "non-serializable obj";
	}
};

export default processArg;