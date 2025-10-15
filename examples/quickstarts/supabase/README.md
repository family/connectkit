# Supabase Quickstart

Supabase authentication integration example with Openfort React and Vite.js.

## Quick Start

Use Openfort CLI to create a new project from this example:

```bash
npm create openfort@latest -t supabase
```

Or, if you prefer, you can download this example using gitpick:

```bash
npx gitpick openfort-xyz/quickstarts/tree/main/react/supabase openfort-supabase && cd openfort-supabase
```

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env.local` file with your Openfort and Supabase configuration.

3. **Start development server**:

   ```bash
   npm run dev
   ```

## Features

- Supabase authentication integration
- Openfort wallet management
- User session handling
- Social login providers
- Email/password authentication

## Architecture Overview

- `src/integrations/supabase` – Supabase client bootstrap, auth error helpers, and the `SupabaseAuthCard` UI.
- `src/integrations/openfort` – Openfort provider wiring, Wagmi configuration, and any shared hooks or logic.
- `src/ui/openfort` – Openfort-specific UI primitives (wallet flows, blockchain cards, profile surfaces).
- `src/components/cards` – Layout shell (`Main`) and hero (`Head`) that orchestrate Supabase and Openfort modules.
- `src/components/ui` – Reusable UI primitives shared by both integrations.

Each integration exposes components and utilities through its `index.ts`, making it easy to swap in your own implementations or restyle specific pieces without touching the underlying wiring.

## Customization Tips

1. Replace `SupabaseAuthCard` with your own brand-aware auth experience while keeping the Openfort wallet flow.
2. Extend `ActionsCard` or `SignCard` to demonstrate additional smart-contract interactions relevant to your project.
3. Update the layout in `src/components/cards/main.tsx` to reorder or hide Openfort/Supabase features per user journey.

## Tech Stack

- React 18
- TypeScript
- Vite
- Supabase JS SDK
- Openfort React SDK
