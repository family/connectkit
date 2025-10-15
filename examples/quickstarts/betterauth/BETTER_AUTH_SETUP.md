# Better Auth Setup Instructions

## Overview

This project uses Better Auth for authentication with a separate backend server.

## Architecture

- **Frontend**: Vite + React (port 5173)
- **Backend**: Express + Better Auth (port 3000)
- **Database**: SQLite (auth.db)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables for Better Auth:
- `BETTER_AUTH_SECRET`: Generate a random secret (you can use `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

Example:
```env
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Initialize Database

Run the Better Auth CLI to create the database tables:

```bash
npx @better-auth/cli migrate
```

### 4. Set Up Local Tunnel (Required for Openfort Custom Authentication)

For development, you need to expose your local backend (port 3000) to the internet so Openfort can communicate with your authentication endpoint. Use a local tunnel service like [localtunnel](https://localtunnel.github.io/www/) or [ngrok](https://ngrok.com/).

**Using localtunnel:**
```bash
npx localtunnel --port 3000
```

This will generate a public URL like `https://cruel-kids-check.loca.lt` that tunnels to your local backend at `http://localhost:3000`.

**Using ngrok:**
```bash
ngrok http 3000
```

**Important:** Copy the generated tunnel URL and configure it in your Openfort dashboard:
1. Go to **Configuration > Providers** in your Openfort dashboard
2. Enable the **Custom** authentication provider
3. Set **Authentication URL** to: `https://your-tunnel-url/api/openfort/verify`
4. Set **Headers** to: `X-Openfort-Secret: dev-shared-secret`

### 5. Run the Application

You have two options:

**Option A: Run both frontend and backend together (recommended)**
```bash
npm run dev:all
```

**Option B: Run them separately**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api/auth
- Tunnel URL: Your generated tunnel URL (e.g., https://cruel-kids-check.loca.lt)

## How It Works

1. The frontend makes requests to `/api/auth/*`
2. Vite's proxy forwards these requests to the backend at `http://localhost:3000`
3. The backend (Express server) handles the authentication logic using Better Auth
4. Responses are sent back through the proxy to the frontend

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

## Troubleshooting

### 404 Error on `/api/auth/sign-in/social`

Make sure:
1. The backend server is running on port 3000
2. You've run the database migration
3. Environment variables are properly set
4. The proxy is configured in `vite.config.ts`

### Database Issues

If you need to reset the database:
```bash
rm auth.db
npx @better-auth/cli migrate
```

## File Structure

```
├── server/
│   ├── auth.ts          # Better Auth instance configuration
│   ├── index.ts         # Express server setup
│   └── tsconfig.json    # TypeScript config for server
├── src/
│   └── integrations/
│       └── betterauth/
│           └── client.ts # Better Auth client configuration
└── vite.config.ts       # Vite config with proxy setup
```
