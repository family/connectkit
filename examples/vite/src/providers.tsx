import React from 'react'
import { OpenfortKitProvider, getDefaultConfig, RecoveryMethod, AuthProvider } from '@openfort/openfort-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig } from 'wagmi'
import { polygonAmoy } from 'viem/chains'

const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit demo',
    walletConnectProjectId: "fc3261354522f71e19adc4081a7e9f53",
    chains: [polygonAmoy],
  })
);

const queryClient = new QueryClient()

export function Providers({ children }: { children?: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider
          // Set the publishable key of your OpenfortKit account. This field is required.
          publishableKey={import.meta.env.VITE_PUBLISHABLE_KEY}

          options={{
            authProviders: [
              AuthProvider.EMAIL,
              AuthProvider.GUEST,
              AuthProvider.WALLET,
              AuthProvider.GOOGLE,
              AuthProvider.FACEBOOK,
              AuthProvider.TWITTER,
            ]
          }}

          // theme="retro"
          // customTheme={theme}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            createEmbeddedSigner: true,

            embeddedSignerConfiguration: {
              shieldPublishableKey: import.meta.env.VITE_SHIELD_PUBLISHABLE_KEY,

              recoveryMethod: RecoveryMethod.PASSWORD,

              // shieldEncryptionKey: import.meta.env.VITE_SHIELD_ENCRYPTION_SHARE,
              createEncryptedSessionEndpoint: "http://localhost:ss3110/api/protected-create-encryption-session",

              ethereumProviderPolicyId: "pol_6b30a204-7f5b-4ba1-bc7f-4de11e922b31",
            }
          }}
        >
          {children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
