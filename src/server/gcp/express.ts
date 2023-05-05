import { Logging } from "@google-cloud/logging";
import type { Request, Response } from "express";

import type LoggingConfig from "./types/config";
import type Log from "./types/log";

const loggingControllerGenerator =
	({ serviceAccount, serviceName, logName, onError }: LoggingConfig) =>
	(req: Request, res: Response) => {
		const { logs } = req.body as { logs: Log[] };

		if (!logs || !Array.isArray(logs)) return res.sendStatus(400);

		const projectId = serviceAccount.project_id;
		const logger = new Logging({ projectId, credentials: serviceAccount });
		const cloudLog = logger.log(logName);

		const generateMetadata = (user: {
			uid?: string;
			email?: string;
			displayName?: string;
		}) => ({
			resource: {
				type: "global",
				labels: {
					service_name: serviceName,
					...user,
				},
			},
		});

		for (let log of logs) {
			if (!log.args || !log.level) continue;

			const logEntry = cloudLog.entry(
				generateMetadata(log.user),
				...(log.args || [])
			);
			const loggerFunction =
				log.level === "info"
					? cloudLog.info
					: log.level === "warn"
					? cloudLog.warning
					: log.level === "error"
					? cloudLog.error
					: cloudLog.debug;
			loggerFunction(logEntry).catch((error: Error | unknown) => {
				if (onError) onError(error);
			});
		}

		return res.sendStatus(200);
	};

export default loggingControllerGenerator;
