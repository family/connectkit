import { getDefaultConfig } from '../../packages/react/build';
import { createConfig } from 'wagmi';
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit Next.js demo',
    chains: [beamTestnet, polygonAmoy, sepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  })
);
