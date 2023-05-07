import type Log from "../types/Log";

const randomRetryDelay = (backoff: number) =>
	new Promise((resolve) =>
		setTimeout(resolve, (backoff || 1) * 250 + Math.floor(50 * Math.random()))
	);

const MAX_RETRIES = 3;

const sendLogs = async (endpoint: string, events: Log[], retriesLeft = MAX_RETRIES) => {
	try {
		await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(events || []),
			headers: { "content-type": "application/json" },
			keepalive: true,
			mode: "no-cors",
		});
	} catch {
		if (retriesLeft) {
			await randomRetryDelay(MAX_RETRIES - retriesLeft);
			sendLogs(endpoint, events, retriesLeft - 1);
		}
	}
};

export default sendLogs;
