# Billet 📒

A seamless way to integrate a logging pipeline from your frontend to your backend.
Currently supports Google Cloud Logging with Express.

<p align="center">
    <img src="https://raw.githubusercontent.com/deve-sh/Billet/main/docs/billet-overview.png" alt="How Billet essentially works"></img>
</p>

## The problem I'm trying to solve here

Whether you work at a small startup or a large company, there is going to be a need to store or access the logs from your client's device at some point or the other. It could be to debug an error or it could be to understand user behaviour via a trail of logs.

Either ways, you end up depending on exception catching software like Sentry that work well for, well, exception catching and everything related to that session. But what if what you're looking at is not an exception or if the exception is a known one and is handled? You lose out on all the useful logs for it unless you have logging setup.

To do so, you usually need to setup a backend ingestion service and a client SDK/lib to send over logs. This library solves the grunt work required to do both of those things.

### Good to haves

A list of things that are not included in the package right now but will be picked up later:
- Entropy based log filtering to hide sensitive data from logs.
- Add more here if you can think of the tons of things that are missed.

## Setting it up

First install the library to both your backend and frontend repositories.

> **Note**: Make sure to always have the same version for billet on both your frontend and backend, Otherwise there can be mismatches in the structure of data expected and returned.

```bash
npm i billet
```

### On the frontend

```javascript
import billet from "billet/client";

billet.init({ endpoint: "", interceptNativeConsoleLogs: true });
```

Here:

- `endpoint` is the URL you want to send your logs to, it could be an endpoint to a log ingestion pipeline or an endpoint on your backend server that is created using the backend SDK of Billet.
- `interceptNativeConsoleLogs` is a `boolean` (By default: `true`) value that will determine whether you want to intercept logs from your frontend app producted by native console functions, namely: `console.log`, `console.debug`, `console.warn` and `console.error`.

#### Logging

If you've opted for intercepting native console functions, you don't have to do anything else, logs from your application will be automatically intercepted and sent to your backend server.

If you want to opt for a manual approach you can use:

```javascript
billet.Logger.info("Info log");
billet.Logger.log("Normal Info log with", "varying", { types }, [of], data);
billet.Logger.error("Error log with: " + error.message);
billet.Logger.warn("Warning");
billet.Logger.debug("Just debugging, how y'all doing?");
```

#### User Identification

You can tag user properties to your logs for tracking:

```javascript
billet.setUser({
	displayName: "user name",
	uid: "<uuid>",
	email: "user@service.com",
});

// If they log out
billet.setUser(null);
```

#### Additional property-based metadata

```javascript
billet.setProperty("isSuperAdmin", true);
billet.setProperty("release-id", "1.0.5-beta");
```

These properties will be sent along with your logs to the server.

### On the backend

#### GCP + Express

I'm assuming you have a basic understanding of what Google Cloud Logging is and what Google Cloud Service Accounts are. If not you can refer to the following:

- [Google Cloud Logging](https://cloud.google.com/logging)
- [Google Clous Service Accounts](https://cloud.google.com/iam/docs/service-account-overview)
- [Creating a Service Account](https://cloud.google.com/iam/docs/service-accounts-create)

And once you have your [Express](https://expressjs.com/) server setup, you can power it up to accept logs from your frontend with the following snippet:

```javascript
app.use(
	"/log", // Any route you want.
	loggingControllerGenerator({
		serviceAccount: JSON.parse(process.env.YOUR_GCP_LOGGING_SERVICE_ACCOUNT),
		logName:
			"a name to group your logs under (for example: frontend-logs-stream)",
		serviceName: "a name to attach with the logs (for example: frontend)",
		onError: (error) => {
			// Do something with the error
		},
	})
);
```

The [@google-cloud/logging](https://www.npmjs.com/package/@google-cloud/logging) library is used with support for automatic retries on failures and log write batching to ensure consistent delivery.

Once done, simply host your server and add its endpoint to the frontend.

## Contributions

Features, bug fixes and contributions are welcome. ☀

I have only added support for GCP logging so far but the number of services available out there are uncountable, so if you have a specific requirement, feel free to add it in.

Simply create an issue for support or fork the repo and raise a pull request for the changes you want to add to the library.
