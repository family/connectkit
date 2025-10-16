# Better Auth Quickstart

Better Auth authentication integration example with Openfort React and Vite.js.

## Quick Start

Use Openfort CLI to create a new project from this example:

```bash
yarn create openfort -t betterauth
```

Or, if you prefer, you can download this example using gitpick:

```bash
npx gitpick openfort-xyz/quickstarts/tree/main/react/quickstarts/betterauth openfort-betterauth && cd openfort-betterauth
```

## Setup

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Configure environment**:
   Create a `.env.local` file with your Openfort and Better Auth configuration.

3. **Configure Openfort Custom Authentication**:
   In your Openfort dashboard, navigate to **Configuration > Providers** and enable the **Custom** authentication provider. Set up:
   - **Authentication URL**: Your local tunnel URL + `/api/openfort/verify` (e.g., `https://your-tunnel.loca.lt/api/openfort/verify`)
   - **Headers**: `X-Openfort-Secret: dev-shared-secret`
   
   See [BETTER_AUTH_SETUP.md](BETTER_AUTH_SETUP.md) for instructions on setting up a local tunnel.

4. **Start development server**:

   ```bash
   yarn dev
   ```

## Features

- Better Auth authentication integration
- Openfort wallet management
- User session handling
- Social login providers
- Email/password authentication

## Architecture Overview

- `src/integrations/betterauth` – Better Auth client bootstrap, auth error helpers, and the `BetterAuthCard` UI.
- `src/integrations/openfort` – Openfort provider wiring, Wagmi configuration, and any shared hooks or logic.
- `src/ui/openfort` – Openfort-specific UI primitives (wallet flows, blockchain cards, profile surfaces).
- `src/components/cards` – Layout shell (`Main`) and hero (`Head`) that orchestrate Better Auth and Openfort modules.
- `src/components/ui` – Reusable UI primitives shared by both integrations.

Each integration exposes components and utilities through its `index.ts`, making it easy to swap in your own implementations or restyle specific pieces without touching the underlying wiring.

## Customization Tips

1. Replace `BetterAuthCard` with your own brand-aware auth experience while keeping the Openfort wallet flow.
2. Extend `ActionsCard` or `SignCard` to demonstrate additional smart-contract interactions relevant to your project.
3. Update the layout in `src/components/cards/main.tsx` to reorder or hide Openfort/Better Auth features per user journey.

## Tech Stack

- React 18
- TypeScript
- Vite
- Better Auth
- Openfort React SDK
