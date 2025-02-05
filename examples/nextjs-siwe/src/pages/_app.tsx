import '@/styles/globals.css';
import { siweClient } from '@/utils/siweClient';
import { OpenfortKitProvider, getDefaultConfig } from 'connectkit';
import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'My ConnectKit App',
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <siweClient.Provider>
        <OpenfortKitProvider>
          <Component {...pageProps} />
        </OpenfortKitProvider>
      </siweClient.Provider>
    </WagmiProvider>
  );
}
