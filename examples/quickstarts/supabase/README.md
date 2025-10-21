# Supabase Quickstart

Supabase authentication integration example with Openfort React and Vite.js.

## Quick Start

```bash
npx gitpick openfort-xyz/openfort-react/tree/main/examples/quickstarts/supabase openfort-supabase && cd openfort-supabase
```

## Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   See [`.env.example`](.env.example) for all required variables and [AGENTS.md](AGENTS.md#environment-configuration) for details on where to obtain each value.

3. **Configure Supabase Authentication**:

   By default, Supabase only enables **Email authentication** which requires **email verification** for security. To use this example, you must configure authentication providers:

   **Email Authentication (Default)**
   - Already enabled by default in new Supabase projects
   - Requires users to verify their email before signing in
   - Users will receive a verification email after signup

   **Google OAuth (Recommended)**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Select your project
   - Navigate to **Authentication** > **Providers**
   - Find **Google** in the provider list and click to configure
   - Enable the Google provider
   - Add your Google OAuth credentials:
     - **Client ID** (from [Google Cloud Console](https://console.cloud.google.com/))
     - **Client Secret**
   - Add authorized redirect URIs:
     - Development: `http://localhost:5173` (or your dev server URL)
     - Production: Your production URL
   - Save changes

   **Email Templates (Optional)**
   - Navigate to **Authentication** > **Email Templates**
   - Customize the "Confirm signup" email template
   - Ensure the confirmation URL points to your application URL

4. **Start development server**:

   ```bash
   pnpm dev
   ```

5. **Check & format (optional)**:

   ```bash
   pnpm check
   pnpm format
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
