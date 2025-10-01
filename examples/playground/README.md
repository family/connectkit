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

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
