import { createAuthClient } from 'better-auth/react';

const betterAuthBasePath = import.meta.env.VITE_BETTERAUTH_BASE_PATH || '/api/auth';

// Initialize Better Auth client
// We're using Vite proxy, so no need to specify baseURL
export const authClient = createAuthClient({
  basePath: betterAuthBasePath,
});

export const { signIn, signUp, signOut, useSession } = authClient;
