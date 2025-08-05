import { OpenfortKitProvider, getDefaultConfig } from '@openfort/openfort-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { useAppStore } from './lib/useAppStore';
import { ThemeProvider } from '@/components/theme-provider';

const config = createConfig(
  // @ts-expect-error: wagmi error
  getDefaultConfig({
    appName: 'OpenfortKit demo',
    walletConnectProjectId: "fc3261354522f71e19adc4081a7e9f53",
    // @ts-expect-error: wagmi error
    chains: [polygonAmoy],
    transports: {
      // @ts-expect-error: wagmi error
      [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology")
    }
  })
);

const queryClient = new QueryClient()

export function Providers({ children }: { children?: React.ReactNode }) {
  const { providerOptions } = useAppStore()
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OpenfortKitProvider
            {...providerOptions}
            uiConfig={{
              ...providerOptions.uiConfig,
            }}
          >
            {children}
          </OpenfortKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}
