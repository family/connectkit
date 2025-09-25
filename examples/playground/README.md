# Openfort React Playground

This is a comprehensive example application demonstrating Openfort React integration with various UI components, routing, and advanced features. It serves as both a playground for testing Openfort features and a reference implementation for building full-scale applications.

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
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your Openfort configuration in `.env.local`.

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

- **`src/components/`** - Reusable UI components
- **`src/pages/`** - Application pages and routes
- **`src/hooks/`** - Custom React hooks
- **`src/lib/`** - Utility functions and configurations
- **`src/stores/`** - Zustand state management stores

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run shadcn` - Add shadcn/ui components

## Openfort Integration

This playground demonstrates various Openfort React features:

- User authentication and session management
- Wallet connection and management
- Transaction signing and processing
- Account recovery flows
- Custom UI components with Openfort hooks
