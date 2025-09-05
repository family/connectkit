import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';

import { getDefaultConfig, OpenfortProvider } from "@openfort/react";
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';


export const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort Next.js demo',
    chains: [beamTestnet, polygonAmoy, sepolia],
    walletConnectProjectId: `fc3261354522f71e19adc4081a7e9f53`,
  })
);

const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={import.meta.env.VITE_PUBLISHABLE_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY!,
            ethereumProviderPolicyId: import.meta.env.VITE_POLICY_ID,
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
