import { getDefaultConfig, aaveAccount, metaMask } from 'connectkit';
import { coinbaseWallet } from 'connectkit/connectors/coinbaseWallet';
import { walletConnect } from 'connectkit/connectors/walletConnect';
import { safe } from 'connectkit/connectors/safe';
import { createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    chains: [mainnet, polygon, optimism, arbitrum],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    connectors: [
      aaveAccount(),
      safe(),
      metaMask(),
      coinbaseWallet(),
      walletConnect(),
    ],
  })
);

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
