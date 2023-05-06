import { Logging, type Log as LogFunction } from "@google-cloud/logging";
import type { Request, Response } from "express";

import type LoggingConfig from "./types/config";
import type Log from "./types/log";

const generateLogMetadata = (
	serviceName: string,
	{
		user,
		uniqueIdentifiers,
	}: { user?: Log["user"]; uniqueIdentifiers?: Log["uniqueIdentifiers"] }
) => {
	return {
		resource: {
			type: "global",
			labels: { service_name: serviceName, ...user, ...uniqueIdentifiers },
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
			if (!log.args || !log.level) continue;

			const logEntry = cloudLog.entry(
				generateLogMetadata(serviceName, log),
				...(log.args || [])
			);

			let loggerFunction:
				| LogFunction['info']
				| LogFunction['debug']
				| LogFunction['error']
				| LogFunction['warning'];
			switch (log.level) {
				case "info":
					loggerFunction = cloudLog.info;
					break;
				case "debug":
					loggerFunction = cloudLog.debug;
					break;
				case "error":
					loggerFunction = cloudLog.error;
					break;
				case "warn":
					loggerFunction = cloudLog.warning;
					break;
				default:
					loggerFunction = cloudLog.info;
			}
			loggerFunction(logEntry).catch((error: Error | unknown) => {
				if (onError) onError(error);
			});
		}

		return res.sendStatus(200);
	};

export default loggingControllerGenerator;
