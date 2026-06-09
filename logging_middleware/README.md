# Logging Middleware

A reusable logging utility for the Affordmed evaluation project.

## Setup

Copy `logger.js` into your project, or import directly.

## Usage

```js
import Log, { setAuthToken } from "./logger";

// Step 1: Set your token once (after auth)
setAuthToken("your_access_token_here");

// Step 2: Use Log() anywhere
Log("frontend", "info",  "page",      "Notifications page opened");
Log("frontend", "error", "api",       "Failed to fetch notifications");
Log("frontend", "warn",  "component", "Empty notification list");
Log("frontend", "debug", "hook",      "useNotifications hook called");
```

## Parameters

| Param   | Allowed Values                                      |
|---------|-----------------------------------------------------|
| stack   | `frontend`, `backend`                               |
| level   | `debug`, `info`, `warn`, `error`, `fatal`           |
| package | `api`, `component`, `hook`, `page`, `state`, `style`|
| message | Any descriptive string                              |

## API

Logs are sent to:
```
POST http://4.224.186.213/evaluation-service/logs
Authorization: Bearer <token>
```
