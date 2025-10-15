# AI Agents & Integration Guide

This document outlines the integration patterns and autonomous components in the Supabase + Openfort quickstart.

## Overview

This project demonstrates how Supabase authentication integrates with Openfort's wallet infrastructure, creating a seamless Web3 authentication experience.

## Integration Agents

### Supabase Authentication Agent

**Location**: [src/integrations/supabase/](src/integrations/supabase/)

Handles user authentication flows including:
- Email/password authentication
- Social login providers (Google, GitHub, etc.)
- Session management
- Auth error handling and user feedback

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
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

See [.env.example](.env.example) for complete configuration.

## Extending the Agents

### Adding New Authentication Providers

1. Configure provider in Supabase Dashboard
2. Update `SupabaseAuthCard` to include new provider UI
3. Add provider-specific error handling in `errors.ts`

### Adding Custom Blockchain Actions

1. Create new action component in `src/ui/openfort/blockchain/`
2. Implement transaction logic using Openfort SDK
3. Add action card to `ActionsCard.tsx` or create standalone card
4. Update `Main.tsx` to include new action in layout

### Custom User Flows

Modify the orchestration in [src/components/cards/main.tsx](src/components/cards/main.tsx) to:
- Reorder component display
- Add conditional rendering based on auth state
- Integrate additional third-party services

## Testing Agent Behavior

When testing integration flows:

1. **Authentication Flow**: Verify Supabase auth state syncs with Openfort
2. **Wallet Creation**: Ensure wallets are created only after successful auth
3. **Error Handling**: Test network failures, auth errors, and transaction rejections
4. **Session Persistence**: Verify auth state persists across page reloads

## Architecture Benefits

- **Modularity**: Each integration is self-contained and swappable
- **Type Safety**: Full TypeScript support across all agents
- **Error Resilience**: Graceful degradation and user-friendly error messages
- **Extensibility**: Easy to add new providers or blockchain actions

## Related Documentation

- [README.md](README.md) - Project setup and quick start
- [Openfort Documentation](https://www.openfort.io/docs)
- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
