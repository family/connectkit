import { OpenfortProvider, getDefaultConfig } from '@openfort/react';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { polygonAmoy, beamTestnet } from 'wagmi/chains';
import { useAppStore } from './lib/useAppStore';
import { ThemeProvider } from '@/components/theme-provider';

const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort demo',
    walletConnectProjectId: "fc3261354522f71e19adc4081a7e9f53",
    chains: [polygonAmoy, beamTestnet],
    transports: {
      [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
      [beamTestnet.id]: http()
    }
  })
);


export function Providers({ children }: { children?: React.ReactNode }) {
  const { providerOptions } = useAppStore()
  const queryClient = useQueryClient();
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
