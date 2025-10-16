# Firebase Quickstart

Firebase authentication integration example with Openfort React and Vite.js.

## Quick Start

Use Openfort CLI to create a new project from this example:

```bash
yarn create openfort -t firebase
```

Or, if you prefer, you can download this example using gitpick:

```bash
npx gitpick openfort-xyz/quickstarts/tree/main/react/quickstarts/firebase openfort-firebase && cd openfort-firebase
```

## Setup

1. **Install dependencies**:

   ```bash
   yarn install
   ```

2. **Configure environment**:
   Create a `.env.local` file with your Openfort and Firebase configuration.

3. **Start development server**:

   ```bash
   yarn dev
   ```

## Features

- Firebase authentication integration
- Openfort wallet management
- User session handling
- Social login providers
- Email/password authentication

## Architecture Overview

- `src/integrations/firebase` – Firebase client bootstrap, auth error helpers, and the `FirebaseAuthCard` UI.
- `src/integrations/openfort` – Openfort provider wiring, Wagmi configuration, and any shared hooks or logic.
- `src/ui/openfort` – Openfort-specific UI primitives (wallet flows, blockchain cards, profile surfaces).
- `src/components/cards` – Layout shell (`Main`) and hero (`Head`) that orchestrate Firebase and Openfort modules.
- `src/components/ui` – Reusable UI primitives shared by both integrations.

Each integration exposes components and utilities through its `index.ts`, making it easy to swap in your own implementations or restyle specific pieces without touching the underlying wiring.

## Customization Tips

1. Replace `FirebaseAuthCard` with your own brand-aware auth experience while keeping the Openfort wallet flow.
2. Extend `ActionsCard` or `SignCard` to demonstrate additional smart-contract interactions relevant to your project.
3. Update the layout in `src/components/cards/main.tsx` to reorder or hide Openfort/Firebase features per user journey.

## Tech Stack

- React 18
- TypeScript
- Vite
- Firebase SDK
- Openfort React SDK
