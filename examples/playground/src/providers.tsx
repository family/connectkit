import { getDefaultConfig, OpenfortProvider } from '@openfort/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type React from 'react'
import { useState } from 'react'
import { createConfig, http, WagmiProvider } from 'wagmi'
import { base, mainnet } from 'wagmi/chains'
import { ThemeProvider } from '@/components/theme-provider'
import { useAppStore } from './lib/useAppStore'

const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort demo',
    walletConnectProjectId: 'fc3261354522f71e19adc4081a7e9f53',
    chains: [base, mainnet],
    transports: {
      [base.id]: http(),
      [mainnet.id]: http(),
    },
  })
)

export function Providers({ children }: { children?: React.ReactNode }) {
  const { providerOptions } = useAppStore()
  const [queryClient] = useState(() => new QueryClient())
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OpenfortProvider
            {...providerOptions}
            uiConfig={{
              ...providerOptions.uiConfig,
            }}
          >
            {children}
          </OpenfortProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
