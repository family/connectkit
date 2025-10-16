import { OpenfortProvider, ThirdPartyOAuthProvider, getDefaultConfig } from '@openfort/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';

import { authClient } from '../betterauth';

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Openfort React demo',
    chains: [beamTestnet, polygonAmoy, sepolia], // Supported chains
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // WalletConnect Project ID
  })
);

const queryClient = new QueryClient();

export function OpenfortProviders({ children }: { children: React.ReactNode }) {
  const openfortPublishableKey = import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY;
  const shieldPublishableKey = import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY;

  if (!openfortPublishableKey) {
    throw new Error('VITE_OPENFORT_PUBLISHABLE_KEY is required');
  }
  if (!shieldPublishableKey) {
    throw new Error('VITE_SHIELD_PUBLISHABLE_KEY is required');
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={openfortPublishableKey}
          walletConfig={{
            shieldPublishableKey, // Get it from https://dashboard.openfort.io
            ethereumProviderPolicyId: import.meta.env.VITE_POLICY_ID, // Policy ID for sponsoring transactions
            createEncryptedSessionEndpoint: import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT, // Endpoint for encryption session
            recoverWalletAutomaticallyAfterAuth: false, // Wallet creation handled manually after auth
          }}
          thirdPartyAuth={{
            getAccessToken: async () => {
              const session = await authClient.getSession();
              return session?.data?.session?.token ?? null;
            },
            provider: ThirdPartyOAuthProvider.CUSTOM,
          }}
        >
          {children}
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
