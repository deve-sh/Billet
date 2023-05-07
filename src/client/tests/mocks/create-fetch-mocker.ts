const createFetchMocker = (mockVariableToUpdate) => {
	// @ts-expect-error
	globalThis.fetch = (endpoint: string, options: unknown) => {
		mockVariableToUpdate = { endpoint, options };
	};
};

export default createFetchMocker;
