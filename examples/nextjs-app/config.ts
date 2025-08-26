import { createConfig } from 'wagmi';
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';
import { getDefaultConfig } from '@openfort/react';

export const config = createConfig(
  getDefaultConfig({
    appName: 'Openfort Next.js demo',
    chains: [beamTestnet, polygonAmoy, sepolia],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  })
);
