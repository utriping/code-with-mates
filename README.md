# Code With Friends

Lightweight Next.js app for connecting friends and sending friend requests.

## Current Status

- **Project scaffolded:** Next.js (App Router) project created.
- **Layout & styles:** Basic layout and global styles implemented.
- **Database connector:** `lib/connectDB.js` added to handle DB connection.
- **API routes:** Friend-request related endpoints implemented under `app/api/auth`.

## What’s implemented (files/folders)

- **App root:** [app/layout.js](app/layout.js#L1) — global layout.
- **Home page:** [app/page.js](app/page.js#L1) — main landing page.
- **Global styles:** [app/globals.css](app/globals.css#L1).
- **API — auth:**
  - [app/api/auth/accept-request/route.js](app/api/auth/accept-request/route.js#L1)
  - [app/api/auth/send-friend-request/route.js](app/api/auth/send-friend-request/route.js#L1)
- **DB helper:** [lib/connectDB.js](lib/connectDB.js#L1)
- **Public assets:** `public/` (static files)

## Notes / Next steps

- Wire up `lib/connectDB.js` to a real database (e.g., MongoDB) and add environment config.
- Add authentication/session handling and users model.
- Expand API tests and client-side integration for friend requests.

## How to run (local)

1. Install deps: `npm install`
2. Run dev server: `npm run dev`

(Adjust environment variables for DB/auth before connecting to a real database.)

Currently working on chat functionality and proper handling of required routes.
