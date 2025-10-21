# Openfort React Playground

This is a comprehensive example application demonstrating Openfort React integration with various UI components, routing, and advanced features. It serves as both a playground for testing Openfort features and a reference implementation for building full-scale applications.

## Quick Start

Download this example using gitpick:

```bash
npx gitpick openfort-xyz/openfort-react/tree/main/examples/playground openfort-playground && cd openfort-playground
```

## Features

- **Openfort React Integration**: Complete integration with authentication, wallet management, and user flows
- **Modern Tech Stack**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Advanced Routing**: TanStack Router with type-safe navigation
- **State Management**: Zustand for global state, React Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.local.example .env.local
   ```

   Then fill in your Openfort configuration in `.env.local`.

3. **Start development server**:

   ```bash
   pnpm dev
   ```

4. **Build for production**:

   ```bash
   pnpm build
   ```

5. **Check & format (optional)**:

   ```bash
   pnpm check
   pnpm format
   ```

## Project Structure

- **`src/components/`** - Reusable UI components
- **`src/pages/`** - Application pages and routes
- **`src/hooks/`** - Custom React hooks
- **`src/lib/`** - Utility functions and configurations
- **`src/stores/`** - Zustand state management stores

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm check` - Run Biome lint & checks
- `pnpm format` - Format source with Biome
- `pnpm preview` - Preview production build
- `pnpm shadcn` - Add shadcn/ui components

## Openfort Integration

This playground demonstrates various Openfort React features:

- User authentication and session management
- Wallet connection and management
- Transaction signing and processing
- Account recovery flows
- Custom UI components with Openfort hooks

## Biome configuration

This example ships with a `biome.json` that mirrors the root project defaults:

- Recommended lint rules with accessibility and React-specific adjustments
- Two-space formatting with single quotes and automatic import organization
- An override that warns when React hooks are missing dependencies

To extend the configuration:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.2.6/schema.json",
  "overrides": [
    {
      "includes": ["src/**/*.ts", "src/**/*.tsx"],
      "linter": {
        "rules": {
          "correctness": {
            "useExhaustiveDependencies": "error"
          }
        }
      }
    }
  ]
}
```

See [Biome docs](https://biomejs.dev/) for the full list of available rules and formatter options.
