import { ReactNode } from 'react';
import { Chain } from 'wagmi';
import { walletConnect } from './connectors/walletConnect';
import { metaMask } from './connectors/metaMask';
import { coinbaseWallet } from './connectors/coinbaseWallet';

export type WalletOptions = {
  chains: Chain[];
  appName?: string;
  shimDisconnect?: boolean;
};
export type WalletProps = {
  id: string;
  name: string;
  shortName?: string;
  logos: {
    default: ReactNode;
    transparent?: ReactNode;
    connectorButton?: ReactNode;
    qrCode?: ReactNode;
    appIcon?: ReactNode;
    mobile?: ReactNode;
  };
  logoBackground?: string;
  scannable?: boolean;
  installed?: boolean;
  downloadUrls?: { [key: string]: string };
  createConnector: () => any;
};

export const getDefaultConnectors = (chains: Chain[], appName: string) => {
  const connectors: any = [
    walletConnect({ chains }),
    metaMask({ chains }),
    coinbaseWallet({
      chains,
      appName,
    }),
    //injected({ chains }),
  ];

  return connectors.map((c: any) => {
    return { ...c.createConnector(), ...c };
  });
};
