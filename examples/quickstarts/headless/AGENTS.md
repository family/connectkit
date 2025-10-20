# AI Agents & Integration Guide

This document outlines the integration patterns and autonomous components in the Headless Openfort quickstart.

## Overview

This project demonstrates a minimal, headless implementation of Openfort's wallet infrastructure without any external authentication providers. It provides a bare-bones approach to building custom Web3 authentication experiences.

## Integration Agents

### Openfort Wallet Agent (Standalone)

**Location**: [src/components/](src/components/)

Manages blockchain wallet operations in a minimal, headless setup:
- Wallet creation and recovery
- Transaction signing
- Smart account integration
- Direct Openfort SDK usage without UI framework

**Key Components**:
- `providers.tsx` - Openfort context and provider setup
- `createWallet.tsx` - Wallet creation logic
- `passwordRecovery.tsx` - Password recovery flows
- Minimal UI components for core functionality

## UI Component Agents

### Wallet Management UI

**Location**: [src/components/cards/](src/components/cards/)

Minimal card-based UI for essential wallet operations:
- Wallet creation interface
- Wallet list display
- Password input and recovery

### Basic UI Primitives

**Location**: [src/components/ui/](src/components/ui/)

Simple UI components providing:
- Button primitives
- Input fields
- Card containers
- Basic styling without external UI libraries

## Autonomous Workflows

### 1. Direct Wallet Creation Flow

```
User Opens App
  → Openfort Provider Initialized
  → Wallet Creation UI Displayed
  → User Creates Wallet
  → Wallet Stored and Managed
```

### 2. Password Recovery Flow

```
User Requests Recovery
  → Recovery UI Presented
  → Password/Credentials Verified
  → Wallet Access Restored
  → User Session Resumed
```

### 3. Transaction Signing Flow

```
User Initiates Transaction
  → Transaction Prepared
  → Password Verification
  → Signature Generated
  → Transaction Submitted
```

## Environment Configuration

Required environment variables for headless operation:

```env
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=sk_test_...
VITE_POLICY_ID=pol_...
VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=/api/shield-session
VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
```

See [.env.example](.env.example) for complete configuration.

## Extending the Agents

### Adding Custom Authentication

Since this is a headless implementation, you can integrate any authentication provider:

1. Create custom authentication logic in `src/components/`
2. Update `providers.tsx` to wrap authentication with Openfort
3. Implement session management according to your auth provider
4. Modify wallet creation flow to integrate with auth state

### Adding Custom Blockchain Actions

1. Create new action components in `src/components/cards/`
2. Implement transaction logic using Openfort SDK directly
3. Add minimal UI for user interaction
4. Update `App.tsx` to include new actions

### Building Custom UI

The headless approach allows complete UI customization:

1. Replace or extend components in `src/components/ui/`
2. Integrate your preferred UI library (Material-UI, shadcn/ui, etc.)
3. Maintain the Openfort provider structure in `providers.tsx`
4. Customize styling in `index.css` or integrate Tailwind/CSS-in-JS

### Adding External Authentication Providers

1. Install your chosen auth library (Firebase, Supabase, Better Auth, etc.)
2. Create auth integration in a new `src/integrations/` folder
3. Update `providers.tsx` to coordinate auth and Openfort states
4. Implement auth-wallet syncing logic

## Testing Agent Behavior

When testing headless flows:

1. **Wallet Creation**: Verify wallets are created and stored correctly
2. **Password Recovery**: Test recovery flows with various scenarios
3. **Direct SDK Integration**: Ensure Openfort SDK calls work without UI abstraction
4. **Session Management**: Verify wallet state persists correctly
5. **Error Handling**: Test edge cases without UI framework safety nets

## Architecture Benefits

- **Minimal Dependencies**: Bare-bones implementation with maximum flexibility
- **Full Control**: Complete ownership of UI and authentication logic
- **Easy Integration**: Simple to integrate with any existing stack
- **Learning Tool**: Clear view of Openfort SDK usage without abstractions
- **Lightweight**: Minimal bundle size and fast load times
- **Customizable**: No opinionated UI framework or auth patterns

## Use Cases

This headless quickstart is ideal for:

- **Custom Implementations**: Building highly customized wallet experiences
- **Learning**: Understanding Openfort SDK fundamentals
- **Rapid Prototyping**: Quick experimentation without UI framework overhead
- **Integration Testing**: Testing Openfort functionality in isolation
- **Migration Base**: Starting point for migrating existing apps to Openfort

## Comparison with Other Quickstarts

Unlike the Firebase, Supabase, or Better Auth quickstarts, this implementation:

- Has no external authentication provider
- Uses minimal UI components
- Provides maximum flexibility
- Requires more custom code for production use
- Serves as a foundation for custom integrations

## Related Documentation

- [README.md](README.md) - Project setup and quick start
- [Openfort Documentation](https://www.openfort.io/docs)
- [Openfort React SDK](https://www.openfort.io/docs/sdk/react)
