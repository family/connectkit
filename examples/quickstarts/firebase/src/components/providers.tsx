import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';

import { getDefaultConfig, OpenfortProvider, ThirdPartyOAuthProvider } from "@openfort/react";
import { beamTestnet, polygonAmoy } from 'viem/chains';
import { auth } from '../integrations/firebase';
import { useState } from 'react';


export const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort Next.js demo',
    chains: [beamTestnet, polygonAmoy], // The chains you want to support
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // The WalletConnect Project ID
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY!, // The public key for your Openfort Shield account get it from https://dashboard.openfort.io

            ethereumProviderPolicyId: import.meta.env.VITE_POLICY_ID, // The policy ID for sponsoring transactions

            createEncryptedSessionEndpoint: import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_BASE_URL + import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT, // Endpoint for encryption session

            recoverWalletAutomaticallyAfterAuth: false, // We will manually call create/setActive wallet after auth
          }}

          thirdPartyAuth={{
            getAccessToken: async () => {
              return (await auth.currentUser?.getIdToken(/* forceRefresh */ false)) ?? null
            },
            provider: ThirdPartyOAuthProvider.FIREBASE,
          }}
        >
          <>
            {children}
          </>
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
