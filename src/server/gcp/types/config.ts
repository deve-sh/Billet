import ServiceAccount from "./service-account";

interface LoggingConfig {
	serviceName: string;
	logName: string;
	serviceAccount: ServiceAccount;
	onError?: (err: Error | unknown) => void;
}

export default LoggingConfig;
