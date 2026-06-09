# Notification System Design

## Overview

A Campus Notification Application that fetches and displays notifications from the Affordmed evaluation server. Built using React + Vite for the frontend.

---

## Architecture

```
┌────────────────────────────────────┐
│           User (Browser)           │
└───────────────┬────────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│       React Frontend (Vite)        │
│                                    │
│  Pages:                            │
│    SetupPage    → register + auth  │
│    NotificationsPage → main UI     │
│                                    │
│  Components:                       │
│    NotificationCard                │
│    FilterBar                       │
│    Pagination                      │
│                                    │
│  Hooks:                            │
│    useNotifications                │
│                                    │
│  Services:                         │
│    api.js → Axios HTTP calls       │
│                                    │
│  Middleware:                       │
│    logger.js → Logging Middleware  │
└──────────┬────────────┬────────────┘
           │            │
           ▼            ▼
┌──────────────┐  ┌──────────────────┐
│ Notification │  │   Log Service    │
│  API Server  │  │                  │
│              │  │ POST /logs       │
│ GET /notifs  │  │ (per action)     │
└──────────────┘  └──────────────────┘
```

---

## Components

### `SetupPage`
Handles pre-test setup:
1. `POST /register` → returns `clientID`, `clientSecret`
2. `POST /auth` → returns `access_token`
3. Token stored in `localStorage` for subsequent API calls

### `NotificationsPage`
Main page that:
- Loads notifications on mount
- Supports type filtering (All / Event / Alert / Placement)
- Supports pagination (`page`, `limit` query params)
- Differentiates new vs read notifications (tracked in localStorage)

### `NotificationCard`
Displays a single notification with:
- Color-coded border/badge by type
- Unread blue dot indicator
- Click to mark as read

### `FilterBar`
Renders filter buttons. On click, calls `changeFilter()` which resets to page 1 and re-fetches.

### `Pagination`
Renders Prev/Next controls using `totalPages` from API response.

---

## Data Flow

```
User opens app
    ↓
Check localStorage for access_token
    ↓ (no token)
SetupPage: register → authenticate → store token
    ↓ (token exists)
NotificationsPage loads
    ↓
useNotifications hook → fetchNotifications(params)
    ↓
GET /evaluation-service/notifications?page=1&limit=10
    ↓
Render NotificationCard list
    ↓
User clicks filter → changeFilter() → re-fetch with type param
User clicks page   → changePage()  → re-fetch with page param
User clicks card   → markRead()    → update localStorage
```

---

## Logging Strategy

Every meaningful user/system action is logged via the Logging Middleware.

### Log function signature
```js
Log(stack, level, package, message)
```

### Log events

| Event                   | Stack    | Level  | Package   | Message                         |
|-------------------------|----------|--------|-----------|---------------------------------|
| Page opened             | frontend | info   | page      | Notifications page opened       |
| Notifications fetched   | frontend | info   | api       | Fetched N notifications         |
| Fetch failed            | frontend | error  | api       | Notification fetch failed: …    |
| Filter changed          | frontend | info   | state     | Filter changed to: Event        |
| Page changed            | frontend | info   | state     | Page changed to: 2              |
| Card marked read        | frontend | info   | component | Notification 123 marked as read |
| Auth success            | frontend | info   | page      | Authentication successful       |
| Auth failed             | frontend | error  | api       | Authentication failed           |
| Hook called             | frontend | debug  | hook      | useNotifications called         |

---

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React 18 + Vite               |
| Routing    | React Router v6               |
| HTTP       | Axios                         |
| Styling    | Inline CSS (no extra deps)    |
| Logging    | Custom middleware (fetch)     |
| State      | React hooks (useState, useEffect, useCallback) |

---

## Folder Structure

```
notification_app_fe/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── middleware/
    │   └── logger.js         ← Logging Middleware
    ├── services/
    │   └── api.js            ← All API calls
    ├── hooks/
    │   └── useNotifications.js
    ├── pages/
    │   ├── SetupPage.jsx     ← Register + Auth
    │   └── NotificationsPage.jsx
    └── components/
        ├── NotificationCard.jsx
        ├── FilterBar.jsx
        └── Pagination.jsx
```

---

## API Endpoints Used

| Method | Endpoint                          | Auth Required | Purpose             |
|--------|-----------------------------------|---------------|---------------------|
| POST   | /evaluation-service/register      | No            | Get clientID/secret |
| POST   | /evaluation-service/auth          | No            | Get access_token    |
| GET    | /evaluation-service/notifications | Yes (Bearer)  | Fetch notifications |
| POST   | /evaluation-service/logs          | Yes (Bearer)  | Send log entry      |

---

## Responsive Design

- Fluid layout with `max-width: 720px` centered container
- `flexWrap` on FilterBar for small screens
- `padding: 0 20px` for mobile edge spacing
- Font sizes and padding scale well on 375px mobile screens
