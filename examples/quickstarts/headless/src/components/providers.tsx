import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, WagmiProvider } from 'wagmi';

import { getDefaultConfig, OpenfortProvider, AccountTypeEnum } from "@openfort/react";
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';


export const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort Next.js demo',
    chains: [polygonAmoy,beamTestnet, sepolia], // The chains you want to support
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // The WalletConnect Project ID
  })
);

const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            accountType: AccountTypeEnum.EOA,
            shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY!, // The public key for your Openfort Shield account get it from https://dashboard.openfort.io
            ethereumProviderPolicyId: import.meta.env.VITE_POLICY_ID, // The policy ID for sponsoring transactions
            createEncryptedSessionEndpoint: import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT, // The endpoint to create an encryption session for automatic wallet recovery
            recoverWalletAutomaticallyAfterAuth: true, // We will manually call create/setActive wallet after auth
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
