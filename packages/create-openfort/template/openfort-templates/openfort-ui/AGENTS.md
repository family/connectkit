# AI Agents & Integration Guide

This document outlines the integration patterns and autonomous components in the Openfort UI quickstart.

## Overview

This project demonstrates a wallet connector implementation using Openfort's pre-built UI components. It showcases how to leverage Openfort's design system for rapid development of Web3 wallet experiences with minimal custom UI code.

## Integration Agents

### Openfort UI Wallet Agent

**Location**: [src/components/](src/components/)

Manages blockchain wallet operations using Openfort's UI components:
- Wallet creation and recovery with pre-built UI
- Transaction signing with styled interfaces
- Smart account integration
- Theme customization support
- WalletConnect integration

**Key Components**:
- `providers.tsx` - Openfort provider with UI configuration
- `createWallet.tsx` - Wallet creation using Openfort UI
- `passwordRecovery.tsx` - Password recovery flows with UI components
- Pre-styled UI components from `@openfort/react`

## UI Component Agents

### Openfort UI Components

**Location**: Provided by `@openfort/react` package

Pre-built, production-ready components including:
- Wallet connection modals
- Transaction signing interfaces
- Account management UI
- Password input components
- WalletConnect UI integration

### Custom Card Components

**Location**: [src/components/cards/](src/components/cards/)

Wrapper components that orchestrate Openfort UI components:
- Card layouts for wallet operations
- Component composition
- State management coordination

### Basic UI Primitives

**Location**: [src/components/ui/](src/components/ui/)

Supplementary UI components for:
- Custom buttons and inputs
- Card containers
- Layout components
- Theme integration

## Autonomous Workflows

### 1. Wallet Connection Flow (UI-Driven)

```
User Opens App
  → Openfort UI Provider Initialized with Theme
  → Wallet Connection UI Displayed
  → User Connects via Openfort UI
  → Wallet State Managed Automatically
```

### 2. Themed Wallet Creation Flow

```
User Initiates Wallet Creation
  → Openfort UI Modal Opens
  → User Follows UI-Guided Flow
  → Wallet Created with Styled Feedback
  → UI Updates Automatically
```

### 3. Transaction Signing with UI

```
User Initiates Transaction
  → Openfort Signing UI Appears
  → Transaction Details Displayed
  → User Confirms via Styled Interface
  → Status Updates in Real-Time
```

## Environment Configuration

Required environment variables with UI configuration:

```env
VITE_OPENFORT_PUBLISHABLE_KEY=pk_test_...
VITE_SHIELD_PUBLISHABLE_KEY=sk_test_...
VITE_POLICY_ID=pol_...
VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT=/api/shield-session
VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
VITE_OPENFORT_THEME=light|dark
```

See [.env.example](.env.example) for complete configuration.

### UI Configuration

The `uiConfig` in [providers.tsx](src/components/providers.tsx:36-38) allows customization:

```typescript
uiConfig: {
  theme: import.meta.env.VITE_OPENFORT_THEME as Theme,
}
```

Supported themes: `light`, `dark`, or custom theme objects.

## Extending the Agents

### Customizing the UI Theme

1. Set `VITE_OPENFORT_THEME` in `.env.local`
2. Or provide custom theme object in `uiConfig`:

```typescript
uiConfig: {
  theme: {
    colors: {
      primary: '#your-color',
      // ... other customizations
    }
  }
}
```

### Adding Custom Blockchain Actions

1. Create new action components in `src/components/cards/`
2. Use Openfort UI components for consistency
3. Implement transaction logic with styled feedback
4. Update `App.tsx` to include new actions

### Integrating WalletConnect

WalletConnect is pre-configured in this quickstart:

1. Ensure `VITE_WALLET_CONNECT_PROJECT_ID` is set
2. WalletConnect UI is automatically available
3. Users can connect external wallets via Openfort UI

### Adding Authentication

To add external authentication while maintaining UI consistency:

1. Install your auth provider (Firebase, Supabase, etc.)
2. Create auth integration in `src/components/`
3. Maintain Openfort UI components for wallet operations
4. Coordinate auth state with Openfort provider

### Custom Wallet Flows

Modify component orchestration in [App.tsx](src/App.tsx) to:
- Reorder UI component display
- Add conditional rendering based on wallet state
- Integrate additional Openfort UI components
- Customize layout while maintaining theme consistency

## Testing Agent Behavior

When testing UI-driven flows:

1. **UI Responsiveness**: Verify Openfort UI components render correctly
2. **Theme Consistency**: Test both light and dark themes
3. **Wallet Connection**: Test various connection methods via UI
4. **WalletConnect Integration**: Verify external wallet connections
5. **Error Handling**: Ensure errors display in styled UI components
6. **Mobile Responsiveness**: Test Openfort UI on different screen sizes

## Architecture Benefits

- **Rapid Development**: Pre-built UI components accelerate development
- **Consistent Design**: Professional, tested UI out of the box
- **Theme Support**: Built-in light/dark mode and customization
- **Accessibility**: Openfort UI components follow accessibility standards
- **WalletConnect Ready**: Built-in WalletConnect UI integration
- **Maintained UI**: Benefit from Openfort's ongoing UI improvements
- **Reduced Bundle Size**: Share UI code with Openfort's optimized components

## Use Cases

This UI quickstart is ideal for:

- **Quick Prototypes**: Rapid wallet integration with polished UI
- **Production Apps**: Production-ready UI components
- **Consistent Branding**: Maintain design consistency with theming
- **WalletConnect Apps**: Apps requiring external wallet connections
- **Team Development**: Shared UI components across team members
- **Reduced Maintenance**: Let Openfort handle UI updates

## Comparison with Other Quickstarts

Unlike the headless quickstart, this implementation:

- Uses pre-built Openfort UI components
- Requires minimal custom UI code
- Provides consistent, professional design
- Includes theme customization
- Has built-in WalletConnect UI
- Ideal for faster development with polished results

Unlike auth-integrated quickstarts (Firebase, Supabase, Better Auth):

- Focuses on wallet UI rather than authentication
- Can be combined with any auth provider
- Demonstrates Openfort's UI component library
- Shows WalletConnect integration patterns

## Related Documentation

- [README.md](README.md) - Project setup and quick start
- [Openfort Documentation](https://www.openfort.io/docs)
- [Openfort React SDK](https://www.openfort.io/docs/sdk/react)
- [Openfort UI Components](https://www.openfort.io/docs/ui-components)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
