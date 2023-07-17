import '@/styles/globals.css';
import { siweClient } from '@/utils/siweClient';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'My ConnectKit App',
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <siweClient.Provider>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </siweClient.Provider>
    </WagmiConfig>
  );
}
