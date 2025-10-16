import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "wagmi";
import { getDefaultConfig, OpenfortProvider, ThirdPartyOAuthProvider } from "@openfort/react";
import { beamTestnet, polygonAmoy, sepolia } from "viem/chains";

import { authClient } from "../betterauth";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Openfort React demo",
    chains: [beamTestnet, polygonAmoy, sepolia], // Supported chains
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // WalletConnect Project ID
  }),
);

const queryClient = new QueryClient();

export function OpenfortProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY!}
          walletConfig={{
            shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY!, // Get it from https://dashboard.openfort.io
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
