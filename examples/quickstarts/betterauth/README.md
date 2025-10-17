# Openfort + Better Auth Example

A clean, production-ready example of integrating [Openfort](https://www.openfort.io/) wallet infrastructure with [Better Auth](https://www.better-auth.com/) for seamless Web3 authentication.

## Quick Start

```bash
npx gitpick openfort-xyz/openfort-react/tree/main/examples/quickstarts/betterauth openfort-betterauth && cd openfort-betterauth
```

## Overview

This monorepo demonstrates how to build a modern authentication system that combines:
- **Better Auth** for user authentication (email/password, social login)
- **Openfort** for blockchain wallet management
- **Secure session handling** between authentication and wallet operations

## Prerequisites

- **Node.js** 18+
- **yarn** or npm
- **Openfort account** - [Sign up here](https://dashboard.openfort.io/)
- **Google OAuth credentials** (optional, for social login)

## Quick Start

**TL;DR**: Install → Configure 2 env files → Run migrations → Start servers

```bash
# 1. Install dependencies
yarn install

# 2. Configure backend
cd apps/server
cp .env.example .env
# Edit .env with your credentials

# 3. Configure frontend
cd ../web
cp .env.local.example .env.local
# Edit .env.local with your keys

# 4. Initialize database
cd ../server
npx @better-auth/cli migrate

# 5. Start both apps
cd ../..
yarn dev
```

---

### 1. Install Dependencies

```bash
yarn install
```

### 2. Configure Environment Variables

**Important**: Environment files are co-located with each app—no shared configuration!

```
apps/
├── server/
│   ├── .env.example      ← Template (copy this to .env)
│   └── .env              ← Your backend secrets (gitignored)
│
└── web/
    ├── .env.local.example ← Template (copy this to .env.local)
    └── .env.local         ← Your frontend config (gitignored)
```

| App          | File                  | Variables                                                | Purpose              |
| ------------ | --------------------- | -------------------------------------------------------- | -------------------- |
| **Backend**  | `apps/server/.env`    | `BETTER_AUTH_*`, `GOOGLE_*`, `OPENFORT_SECRET_KEY`, etc. | Server secrets       |
| **Frontend** | `apps/web/.env.local` | `VITE_*`                                                 | Public client config |


#### a) Backend Setup

```bash
cd apps/server
cp .env.example .env
# Edit .env with your values
```

Required variables:

```env
# Better Auth
BETTER_AUTH_SECRET=your-random-secret-here  # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Openfort
OPENFORT_SECRET_KEY=sk_test_...
SHIELD_API_KEY=your-shield-api-key
SHIELD_ENCRYPTION_SHARE=your-shield-encryption-share
SHIELD_SECRET_KEY=your-shield-secret-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### b) Frontend Setup

```bash
cd apps/web
cp .env.local.example .env.local
# Edit .env.local with your values
```

Required variables:

```env
# Openfort
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=sk_test_...
VITE_POLICY_ID=pol_...
VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id

# Better Auth
VITE_BETTERAUTH_URL=http://localhost:3000
VITE_BETTERAUTH_BASE_PATH=/api/auth
```

### 3. Initialize Database

```bash
cd apps/server
npx @better-auth/cli migrate
```

This creates the SQLite database (`auth.db`) in the server directory.

### 4. Configure Openfort Custom Authentication

For Openfort to verify user sessions, you need to expose your local backend to the internet during development:

#### Option A: Using localtunnel

```bash
npx localtunnel --port 3000
```

#### Option B: Using ngrok

```bash
ngrok http 3000
```

Copy the generated public URL (e.g., `https://your-tunnel-url.loca.lt`) and configure it in your [Openfort Dashboard](https://dashboard.openfort.io/):

1. Navigate to **Configuration > Providers**
2. Enable the **Custom** authentication provider
3. Set **Authentication URL**: `https://your-tunnel-url/api/openfort/verify`
4. Set **Headers**: `X-Openfort-Secret: dev-shared-secret`

### 5. Start Development Servers

Run both frontend and backend concurrently:

```bash
yarn dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
yarn workspace @openfort-betterauth/server dev

# Terminal 2 - Frontend
yarn workspace @openfort-betterauth/web dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api/auth
- **Health Check**: http://localhost:3000/health

## Environment Variables Reference

**File Locations:**
- Backend variables: **`apps/server/.env`**
- Frontend variables: **`apps/web/.env.local`**

### Backend Variables (`apps/server/.env`)

| Variable                  | Description                          | Required |
| ------------------------- | ------------------------------------ | -------- |
| `BETTER_AUTH_SECRET`      | Random secret for session encryption | Yes      |
| `BETTER_AUTH_URL`         | Backend URL                          | Yes      |
| `GOOGLE_CLIENT_ID`        | Google OAuth client ID               | No       |
| `GOOGLE_CLIENT_SECRET`    | Google OAuth client secret           | No       |
| `FRONTEND_URL`            | Frontend URL for CORS                | Yes      |
| `OPENFORT_SECRET_KEY`     | Openfort secret key                  | Yes      |
| `SHIELD_API_KEY`          | Shield encryption API key            | Yes      |
| `SHIELD_ENCRYPTION_SHARE` | Shield encryption share              | Yes      |
| `SHIELD_SECRET_KEY`       | Shield secret key                    | Yes      |

### Frontend Variables (`apps/web/.env.local`)

| Variable                         | Description              | Required |
| -------------------------------- | ------------------------ | -------- |
| `VITE_OPENFORT_PUBLISHABLE_KEY`  | Openfort publishable key | Yes      |
| `VITE_SHIELD_PUBLISHABLE_KEY`    | Shield publishable key   | Yes      |
| `VITE_POLICY_ID`                 | Openfort policy ID       | Yes      |
| `VITE_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | No       |
| `VITE_BETTERAUTH_URL`            | Backend URL              | Yes      |
| `VITE_BETTERAUTH_BASE_PATH`      | Auth API base path       | Yes      |

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Navigate to **Credentials** → **Create OAuth 2.0 Client ID**
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to `apps/server/.env`

## Project Structure

```
openfort-betterauth/
├── apps/
│   ├── web/                      # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── components/       # Shared UI components
│   │   │   ├── integrations/     # Integration layers
│   │   │   │   ├── betterauth/   # Better Auth integration
│   │   │   │   └── openfort/     # Openfort integration
│   │   │   └── ui/               # Openfort-specific UI
│   │   ├── .env.local            # Frontend environment variables
│   │   ├── .env.local.example    # Frontend env template
│   │   └── package.json
│   │
│   └── server/                   # Backend (Express + Better Auth)
│       ├── auth.ts               # Better Auth configuration
│       ├── better-auth.ts        # CLI export
│       ├── index.ts              # Express server
│       ├── .env                  # Backend environment variables
│       ├── .env.example          # Backend env template
│       ├── auth.db               # SQLite database (generated)
│       └── package.json
│
├── package.json                  # Root workspace configuration
└── README.md                     # This file
```

### Architecture

**Frontend** (`apps/web`):
- Vite-powered React application
- Better Auth client for authentication
- Openfort React SDK for wallet operations
- Wagmi + Viem for blockchain interactions

**Backend** (`apps/server`):
- Express server with Better Auth
- SQLite database for user data
- Custom Openfort verification endpoint
- Session management and CORS handling

## Features

- **Email/Password Authentication** - Traditional auth flow
- **Social Login** - Google OAuth (extensible to other providers)
- **Wallet Management** - Create and manage Openfort smart accounts
- **Blockchain Interactions** - Sign transactions and interact with smart contracts
- **Session Syncing** - Automatic session synchronization between auth and wallet
- **Type Safety** - Full TypeScript support across frontend and backend
- **Modular Architecture** - Clean separation of concerns, easy to extend

## Tech Stack

### Frontend
- React 18
- TypeScript 5
- Vite 6
- Tailwind CSS 4
- Better Auth (client)
- Openfort React SDK
- Wagmi + Viem
- TanStack Query

### Backend
- Node.js
- Express
- Better Auth
- Better SQLite3
- Openfort Node SDK

### Development Tools
- Yarn workspaces
- Biome (linting & formatting)
- concurrently

## Scripts

```bash
# Development
yarn dev              # Run both apps concurrently
yarn build            # Build both apps

# Code Quality
yarn check            # Check code with Biome
yarn format           # Format code
```

## Customization

### Adding New Authentication Providers

1. Update `apps/server/auth.ts` to add provider configuration
2. Update the UI in `apps/web/src/integrations/betterauth/components/BetterAuthCard.tsx`

### Adding Custom Blockchain Actions

1. Create new action components in `apps/web/src/ui/openfort/blockchain/`
2. Implement transaction logic using Openfort SDK
3. Add action cards to your layout

### Modifying the Layout

Edit `apps/web/src/components/cards/main.tsx` to reorder or customize the UI flow.

## Troubleshooting

### Database Issues

If you encounter database errors, try resetting:

```bash
cd apps/server
rm auth.db
npx @better-auth/cli migrate
```

### Authentication Not Working

1. Verify backend server is running on port 3000
2. Check environment variables are set correctly in **both** `apps/server/.env` and `apps/web/.env.local`
3. Ensure Vite proxy is configured (already set in `vite.config.ts`)
4. Check browser console for error messages

### Openfort Custom Auth Fails

1. Verify your local tunnel is running and accessible
2. Check Openfort dashboard configuration matches tunnel URL
3. Ensure headers are set correctly: `X-Openfort-Secret: dev-shared-secret`

## Learn More

- [Openfort Documentation](https://www.openfort.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Wagmi Documentation](https://wagmi.sh/)

## License

MIT
