import { ReactNode } from 'react';
import Logos from './../assets/chains';

type Chain = { id: number; name: string; logo: ReactNode };
const supportedChains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    logo: <Logos.Ethereum />,
  },
  {
    id: 3,
    name: 'Rinkeby',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 4,
    name: 'Ropsten',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 5,
    name: 'Görli',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 42,
    name: 'Kovan',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 10,
    name: 'Optimism',
    logo: <Logos.Optimism />,
  },
  {
    id: 69, // nice
    name: 'Optimism Kovan',
    logo: <Logos.Optimism testnet />,
  },
  {
    id: 137,
    name: 'Polygon',
    logo: <Logos.Polygon />,
  },
  {
    id: 80001,
    name: 'Polygon Mumbai',
    logo: <Logos.Polygon testnet />,
  },
  {
    id: 31337,
    name: 'Hardhat',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 1337,
    name: 'Localhost',
    logo: <Logos.Ethereum testnet />,
  },
  {
    id: 42161,
    name: 'Arbitrum',
    logo: <Logos.Arbitrum />,
  },
  {
    id: 421611,
    name: 'Arbitrum Rinkeby',
    logo: <Logos.Arbitrum testnet />,
  },
];

export default supportedChains;
