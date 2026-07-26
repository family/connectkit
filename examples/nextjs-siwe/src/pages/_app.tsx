import '@/styles/globals.css';
import { siweClient } from '@/utils/siweClient';
import {
  ConnectKitProvider,
  getDefaultConfig,
  aaveAccount,
  metaMask,
} from 'connectkit';
import { coinbaseWallet } from 'connectkit/connectors/coinbaseWallet';
import { walletConnect } from 'connectkit/connectors/walletConnect';
import { safe } from 'connectkit/connectors/safe';
import type { AppProps } from 'next/app';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: 'My ConnectKit App',
    connectors: [
      aaveAccount(),
      safe(),
      metaMask(),
      coinbaseWallet(),
      walletConnect(),
    ],
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <siweClient.Provider>
        <ConnectKitProvider>
          <Component {...pageProps} />
        </ConnectKitProvider>
      </siweClient.Provider>
    </WagmiProvider>
  );
}
