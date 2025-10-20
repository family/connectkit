# AI Agents & Integration Guide

This document outlines the integration patterns and autonomous components in the Better Auth + Openfort quickstart.

## Overview

This project demonstrates how Better Auth authentication integrates with Openfort's wallet infrastructure, creating a seamless Web3 authentication experience with a custom backend server.

## Integration Agents

### Better Auth Authentication Agent

**Location**: [apps/web/src/integrations/betterauth/](apps/web/src/integrations/betterauth/)

Handles user authentication flows including:
- Email/password authentication
- Social login providers (Google, extensible to others)
- Session management
- Auth error handling and user feedback

**Key Components**:
- `BetterAuthCard` - Main authentication UI component
- `client.ts` - Better Auth client initialization
- Backend server (`apps/server/`) - Express server with Better Auth

### Openfort Wallet Agent

**Location**: [apps/web/src/integrations/openfort/](apps/web/src/integrations/openfort/)

Manages blockchain wallet operations:
- Wallet creation and recovery
- Transaction signing
- Smart account integration
- Wagmi configuration

**Key Components**:
- `providers.tsx` - Openfort context and provider setup
- Wallet creation flows
- Profile management
- Blockchain interactions

## UI Component Agents

### Wallet Management UI

**Location**: [apps/web/src/ui/openfort/wallets/](apps/web/src/ui/openfort/wallets/)

- `WalletCreation.tsx` - Handles wallet onboarding
- `WalletListCard.tsx` - Displays user wallets
- `WalletPasswordSheets.tsx` - Secure password input flows

### Blockchain Actions UI

**Location**: [apps/web/src/ui/openfort/blockchain/](apps/web/src/ui/openfort/blockchain/)

- `ActionsCard.tsx` - Smart contract interaction UI
- `SignCard.tsx` - Transaction signing interface

### User Profile UI

**Location**: [apps/web/src/ui/openfort/profile/](apps/web/src/ui/openfort/profile/)

- `UserProfileCard.tsx` - User identity and wallet information display

## Backend Agent

### Better Auth Server

**Location**: [apps/server/](apps/server/)

Node.js/Express backend handling:
- Better Auth configuration and session management
- Custom Openfort verification endpoint
- SQLite database for user data
- CORS and security middleware

**Key Files**:
- `auth.ts` - Better Auth configuration
- `index.ts` - Express server setup
- Custom verification endpoint for Openfort custom authentication

## Autonomous Workflows

### 1. Authentication → Wallet Creation Flow

```
User Signs In (Better Auth)
  → Session Created in Backend
  → Auth Token Generated
  → Openfort Provider Initialized
  → Wallet Creation Triggered (if needed)
  → User Profile Displayed
```

### 2. Custom Authentication Verification Flow

```
Openfort SDK Requests Verification
  → Backend /api/openfort/verify Endpoint Called
  → Session Validated
  → User Identity Confirmed
  → Wallet Operations Authorized
```

### 3. Transaction Signing Flow

```
User Initiates Action
  → Transaction Prepared
  → Password/Auth Verification
  → Signature Generated
  → Transaction Submitted
  → Status Updated
```

## Environment Configuration

This quickstart uses two separate environment files:

### Backend Variables (`apps/server/.env`)

```env
BETTER_AUTH_SECRET=your-random-secret-here
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENFORT_SECRET_KEY=sk_test_...
SHIELD_API_KEY=your-shield-api-key
SHIELD_ENCRYPTION_SHARE=your-shield-encryption-share
SHIELD_SECRET_KEY=your-shield-secret-key
FRONTEND_URL=http://localhost:5173
```

### Frontend Variables (`apps/web/.env.local`)

```env
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=sk_test_...
VITE_POLICY_ID=pol_...
VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
VITE_BETTERAUTH_URL=http://localhost:3000
VITE_BETTERAUTH_BASE_PATH=/api/auth
```

See [apps/server/.env.example](apps/server/.env.example) and [apps/web/.env.local.example](apps/web/.env.local.example) for complete configuration.

## Extending the Agents

### Adding New Authentication Providers

1. Configure provider in `apps/server/auth.ts`
2. Update `BetterAuthCard` to include new provider UI
3. Add provider-specific error handling
4. Update OAuth redirect URIs in provider console

### Adding Custom Blockchain Actions

1. Create new action component in `apps/web/src/ui/openfort/blockchain/`
2. Implement transaction logic using Openfort SDK
3. Add action card to `ActionsCard.tsx` or create standalone card
4. Update `Main.tsx` to include new action in layout

### Custom User Flows

Modify the orchestration in [apps/web/src/components/cards/main.tsx](apps/web/src/components/cards/main.tsx) to:
- Reorder component display
- Add conditional rendering based on auth state
- Integrate additional third-party services

### Extending Backend Functionality

Modify [apps/server/index.ts](apps/server/index.ts) to:
- Add custom API endpoints
- Implement additional verification logic
- Integrate with other backend services
- Add middleware for rate limiting, logging, etc.

## Testing Agent Behavior

When testing integration flows:

1. **Authentication Flow**: Verify Better Auth state syncs with Openfort
2. **Backend Connectivity**: Ensure frontend can reach backend server
3. **Wallet Creation**: Ensure wallets are created only after successful auth
4. **Custom Auth Verification**: Test Openfort custom auth endpoint with tunnel/ngrok
5. **Error Handling**: Test network failures, auth errors, and transaction rejections
6. **Session Persistence**: Verify auth state persists across page reloads

## Architecture Benefits

- **Full Stack Control**: Complete ownership of authentication logic
- **Modularity**: Each integration is self-contained and swappable
- **Type Safety**: Full TypeScript support across frontend and backend
- **Error Resilience**: Graceful degradation and user-friendly error messages
- **Extensibility**: Easy to add new providers or blockchain actions
- **Workspace Architecture**: Clean monorepo structure with Yarn workspaces

## Related Documentation

- [README.md](README.md) - Project setup and quick start
- [Openfort Documentation](https://www.openfort.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
