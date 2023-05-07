import { v4 as uuid } from "uuid";
import { get as getCookie, set as setCookie } from "js-cookie";

import type Log from "./types/Log";
import type User from "./types/User";
import type FLogClientConfig from "./types/config";

import sendLogs from "./utils/send";
import overWriteConsoleFunctions from "./utils/overwrite-console-functions";

const LOG_SENDING_INTERVAL = 5000;

class FLog {
	private initialized: boolean = false;
	private config: FLogClientConfig = { endpoint: "" };
	private logs: Log[] = [];
	private userInfo?: User | null;
	private properties: Record<string, unknown> = {};
	private sessionId: string;
	private tabId: string;

	private sendLogsInterval: NodeJS.Timer;

	constructor() {}

	init(config: FLogClientConfig) {
		if (this.initialized) return;

		const { overwriteConsoleFunctions = true, endpoint } = config;

		if (!endpoint) throw new Error("FLog: Endpoint is required to send logs");

		this.config = { overwriteConsoleFunctions, endpoint };

		this.setTabId();
		this.setSessionId();
		this.setSendLogsInterval();
		this.mountUnloadListener();
		this.overwriteConsoleFunctions();
	}

	setUser = (user: User | null) => {
		this.userInfo = user;
	};

	setProperty = (propertyName: string, propertyValue: unknown) => {
		this.properties[propertyName] = propertyValue;
	};

	private processLog = (log: Log) => {
		return {
			...log,
			properties: this.properties,
			user: this.userInfo ? { ...this.userInfo } : null,
			sessionId: this.sessionId,
			tabId: this.tabId,
		};
	};

	private setTabId = () => {
		this.tabId = uuid();
	};

	private setSessionId = () => {
		let sessionId = getCookie("flog_session_id");
		if (!sessionId) {
			sessionId = uuid();
			setCookie("flog_session_id", sessionId);
			this.sessionId = sessionId;
		}
	};

	private sendLogs = () => {
		if (this.logs.length)
			sendLogs(this.config.endpoint, this.logs.map(this.processLog));
		this.logs = [];
	};

	private setSendLogsInterval = () => {
		this.sendLogsInterval = setInterval(this.sendLogs, LOG_SENDING_INTERVAL);
	};

	private mountUnloadListener = () => {
		window.onbeforeunload = this.sendLogs;
	};

	destroy() {
		this.sendLogs();
		this.logs = [];
		this.userInfo = null;
		this.properties = {};
		clearTimeout(this.sendLogsInterval);
		this.initialized = false;
		this.config = { endpoint: "" };
	}

	//#region Logging Functions
	private overwriteConsoleFunctions() {
		overWriteConsoleFunctions(this.logs.push);
	}
	//#endregion
}

export default new FLog();
