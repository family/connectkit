import {
  getDefaultConfig,
  OpenfortProvider,
  ThirdPartyOAuthProvider,
} from '@openfort/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'

import { supabase } from '../supabase'

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Openfort React demo',
    chains: [beamTestnet, polygonAmoy, sepolia], // Supported chains
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // WalletConnect Project ID
  }),
)

const queryClient = new QueryClient()

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
            // If you want to use AUTOMATIC embedded wallet recovery, an encryption session is required.
            // See: https://www.openfort.io/docs/products/embedded-wallet/react-native/quickstart/automatic
            // For backend setup, check: https://github.com/openfort-xyz/openfort-backend-quickstart
            createEncryptedSessionEndpoint:
              import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_BASE_URL +
              import.meta.env.VITE_CREATE_ENCRYPTED_SESSION_ENDPOINT,
            recoverWalletAutomaticallyAfterAuth: true, // Wallet creation handled manually after auth
          }}
          thirdPartyAuth={{
            getAccessToken: async () => {
              console.log('supabase: getting token')
              const {
                data: { session },
              } = await supabase.auth.getSession()
              console.log('supabase: got token', session?.access_token)
              return session?.access_token ?? null
            },
            provider: ThirdPartyOAuthProvider.SUPABASE,
          }}
        >
          {children}
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
