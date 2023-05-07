import { Logging } from "@google-cloud/logging";
import type { Request, Response } from "express";

import type LoggingConfig from "./types/config";
import type Log from "./types/log";

const generateLogMetadata = (serviceName: string, log: Log) => {
	return {
		resource: {
			type: "global",
			labels: { service: serviceName },
		},
		severity: log.level.toUpperCase(),
	};
};

const formatLog = (log: Log) => {
	const logContentIfObject = log.logContent as {
		message?: string;
		messages?: string[];
	};
	return {
		message:
			logContentIfObject?.messages ||
			logContentIfObject?.message ||
			log.logContent ||
			"",
		metadata: {
			...log.user,
			properties: { ...log.properties },
			createdAt: new Date(log.createdAt),
		},
	};
};

const loggingControllerGenerator =
	({ serviceAccount, serviceName, logName, onError }: LoggingConfig) =>
	(req: Request, res: Response) => {
		const { logs } = req.body as { logs: Log[] };

		if (!logs || !Array.isArray(logs)) return res.sendStatus(400);

		const projectId = serviceAccount.project_id;
		const logger = new Logging({ projectId, credentials: serviceAccount });
		const cloudLog = logger.log(logName);

		for (let log of logs) {
			if (!log.level) continue;

			const logEntry = cloudLog.entry(
				generateLogMetadata(serviceName, log),
				formatLog(log)
			);
			cloudLog.write(logEntry).catch((error) => {
				if (onError) onError(error);
			});
		}

		return res.sendStatus(200);
	};

export default loggingControllerGenerator;
