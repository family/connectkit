# AI Agents & Integration Guide

This document outlines the integration patterns and autonomous components in the Supabase + Openfort quickstart.

## Overview

This project demonstrates how Supabase authentication integrates with Openfort's wallet infrastructure, creating a seamless Web3 authentication experience using Vite.js and React 18.

## Architecture Overview

The codebase is organized into distinct layers for maximum modularity:

- **`src/integrations/supabase/`** – Supabase client bootstrap, auth error helpers, and the `SupabaseAuthCard` UI
- **`src/integrations/openfort/`** – Openfort provider wiring, Wagmi configuration, and shared hooks/logic
- **`src/ui/openfort/`** – Openfort-specific UI primitives (wallet flows, blockchain cards, profile surfaces)
- **`src/components/cards/`** – Layout shell (`Main`) and hero (`Head`) that orchestrate Supabase and Openfort modules
- **`src/components/ui/`** – Reusable UI primitives shared by both integrations

Each integration exposes components and utilities through its `index.ts`, making it easy to swap in custom implementations or restyle specific pieces without touching the underlying wiring.

## Integration Agents

### Supabase Authentication Agent

**Location**: [src/integrations/supabase/](src/integrations/supabase/)

Handles user authentication flows including:
- Email/password authentication with email verification
- Social login providers (Google OAuth recommended, GitHub, etc.)
- Session management
- Auth error handling and user feedback
- Email template customization support

**Key Components**:
- `SupabaseAuthCard` - Main authentication UI component
- `client.ts` - Supabase client initialization
- `errors.ts` - Authentication error handling utilities

### Openfort Wallet Agent

**Location**: [src/integrations/openfort/](src/integrations/openfort/)

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

**Location**: [src/ui/openfort/wallets/](src/ui/openfort/wallets/)

- `WalletCreation.tsx` - Handles wallet onboarding
- `WalletListCard.tsx` - Displays user wallets
- `WalletPasswordSheets.tsx` - Secure password input flows

### Blockchain Actions UI

**Location**: [src/ui/openfort/blockchain/](src/ui/openfort/blockchain/)

- `ActionsCard.tsx` - Smart contract interaction UI
- `SignCard.tsx` - Transaction signing interface

### User Profile UI

**Location**: [src/ui/openfort/profile/](src/ui/openfort/profile/)

- `UserProfileCard.tsx` - User identity and wallet information display

## Autonomous Workflows

### 1. Authentication → Wallet Creation Flow

```
User Signs In (Supabase)
  → Auth Token Generated
  → Openfort Provider Initialized
  → Wallet Creation Triggered (if needed)
  → User Profile Displayed
```

### 2. Transaction Signing Flow

```
User Initiates Action
  → Transaction Prepared
  → Password/Auth Verification
  → Signature Generated
  → Transaction Submitted
  → Status Updated
```

## Environment Configuration

Required environment variables for agent operation:

```env
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=sk_test_...
VITE_POLICY_ID=pol_...
VITE_CREATE_ENCRYPTED_SESSION_BASE_URL=http://localhost:5000
VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=/api/shield-session
VITE_WALLET_CONNECT_PROJECT_ID=YOUR_WALLET_CONNECT_PROJECT_ID
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

See [.env.example](.env.example) for complete configuration.

### Development Server Configuration

The Vite development server automatically proxies Shield session requests to your backend server (configured in [vite.config.ts](vite.config.ts:13-17)). This allows the frontend to communicate with your Shield authentication backend without CORS issues during development.

## Extending the Agents

### Adding New Authentication Providers

1. Navigate to **Authentication** > **Providers** in [Supabase Dashboard](https://app.supabase.com/)
2. Enable and configure the desired provider (e.g., Google, GitHub)
3. Add OAuth credentials (Client ID, Client Secret)
4. Configure authorized redirect URIs for development and production
5. Update `SupabaseAuthCard` to include new provider UI
6. Add provider-specific error handling in `errors.ts`

### Configuring Email Authentication

**Email verification is enabled by default** for security. To customize:

1. Navigate to **Authentication** > **Email Templates** in Supabase Dashboard
2. Customize the "Confirm signup" email template
3. Ensure confirmation URL points to your application URL
4. Test the email flow with a real email address

### Adding Custom Blockchain Actions

1. Create new action component in `src/ui/openfort/blockchain/`
2. Implement transaction logic using Openfort SDK
3. Extend `ActionsCard` or `SignCard` to demonstrate additional smart-contract interactions
4. Update [src/components/cards/main.tsx](src/components/cards/main.tsx) to include new action in layout

### Custom User Flows

Modify the orchestration in [src/components/cards/main.tsx](src/components/cards/main.tsx) to:
- Reorder component display
- Add conditional rendering based on auth state
- Integrate additional third-party services
- Hide or show Openfort/Supabase features per user journey

### Customizing Authentication Experience

1. Replace `SupabaseAuthCard` with your own brand-aware auth experience
2. Keep the Openfort wallet flow intact while updating auth UI
3. Maintain the integration layer in `src/integrations/supabase/` for easy swapping

## Testing Agent Behavior

When testing integration flows:

1. **Email Verification Flow**: Test email signup and verification process with real email addresses
2. **Authentication Flow**: Verify Supabase auth state syncs with Openfort
3. **OAuth Providers**: Test Google OAuth and other configured social login providers
4. **Wallet Creation**: Ensure wallets are created only after successful auth
5. **Error Handling**: Test network failures, auth errors, and transaction rejections
6. **Session Persistence**: Verify auth state persists across page reloads

## Architecture Benefits

- **Modularity**: Each integration is self-contained and swappable via clean `index.ts` exports
- **Type Safety**: Full TypeScript support across all agents
- **Error Resilience**: Graceful degradation and user-friendly error messages
- **Extensibility**: Easy to add new providers or blockchain actions without touching core wiring
- **Clear Separation**: Distinct layers for integrations, UI primitives, and orchestration
- **Easy Customization**: Replace or restyle individual components while maintaining functionality
- **Email Verification**: Built-in secure email verification flow for production use

## Related Documentation

- [README.md](README.md) - Project setup and quick start
- [Openfort Documentation](https://www.openfort.io/docs)
- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
