import { ReactNode } from 'react';
import logos from './../assets/chains';

type Chain = { id: number; name: string; logo: ReactNode };
const supportedChains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    logo: logos.Ethereum,
  },
  {
    id: 10,
    name: 'Optimism',
    logo: logos.Optimism,
  },
  {
    id: 42161,
    name: 'Arbitrum',
    logo: logos.Arbitrum,
  },
  {
    id: 137,
    name: 'Polygon',
    logo: logos.Polygon,
  },
];

export default supportedChains;
