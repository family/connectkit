import { getDefaultConfig } from '@openfort/openfort-kit';
import { createConfig } from 'wagmi';
import { beamTestnet, polygonAmoy, sepolia } from 'viem/chains';

export const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    chains: [beamTestnet, polygonAmoy, sepolia],
  })
);
