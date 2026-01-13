import {
  getDefaultConfig,
  OpenfortProvider,
  ThirdPartyOAuthProvider,
} from '@openfort/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'

import { authClient } from '../betterauth'

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Openfort React demo',
    chains: [beamTestnet, polygonAmoy, sepolia], // Supported chains
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID, // WalletConnect Project ID
  }),
)

const queryClient = new QueryClient()

export function OpenfortProviders({ children }: { children: React.ReactNode }) {
  const openfortPublishableKey = import.meta.env.VITE_OPENFORT_PUBLISHABLE_KEY
  const shieldPublishableKey = import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY

  if (!openfortPublishableKey) {
    throw new Error('VITE_OPENFORT_PUBLISHABLE_KEY is required')
  }
  if (!shieldPublishableKey) {
    throw new Error('VITE_SHIELD_PUBLISHABLE_KEY is required')
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
            getEncryptionSession: async () => {
              try {
                const session = await authClient.getSession()
                const token = session?.data?.session?.token

                if (!token) {
                  console.error('Better Auth - No token available')
                  return null
                }

                const response = await fetch(
                  `${import.meta.env.VITE_BETTERAUTH_URL + import.meta.env.VITE_BETTERAUTH_BASE_PATH}/encryption-session`,
                  {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  },
                )

                if (!response.ok) {
                  console.error(
                    'Better Auth - Failed to get encryption session:',
                    response.status,
                  )
                  return null
                }

                const data = await response.json()
                console.log('Better Auth - Retrieved encryption session:', data)
                return data.sessionId ?? data?.sessionId ?? null
              } catch (error) {
                console.error(
                  'Better Auth - Error getting encryption session:',
                  error,
                )
                return null
              }
            },
            recoverWalletAutomaticallyAfterAuth: false, // Wallet creation handled manually after auth
          }}
          thirdPartyAuth={{
            getAccessToken: async () => {
              const session = await authClient.getSession()
              return session?.data?.session?.token ?? null
            },
            provider: ThirdPartyOAuthProvider.BETTER_AUTH,
          }}
        >
          {children}
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
