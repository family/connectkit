import { OpenfortKitProvider, getDefaultConfig } from '@openfort/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy, beamTestnet } from 'wagmi/chains';
import { useAppStore } from './lib/useAppStore';
import { ThemeProvider } from '@/components/theme-provider';

const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit demo',
    walletConnectProjectId: "fc3261354522f71e19adc4081a7e9f53",
    chains: [polygonAmoy, beamTestnet],
    transports: {
      [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
      [beamTestnet.id]: http()
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
