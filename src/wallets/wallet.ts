import { ReactNode } from 'react';
import { walletConnect, metaMask, coinbaseWallet } from './';

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
  installed?: () => boolean;
  downloadUrls?: { [key: string]: string };
  createConnector?: () => any;
};

export const getDefaultConnectors = (chains, appName) => {
  const connectors: any = [
    walletConnect({ chains }),
    metaMask({ chains }),
    coinbaseWallet({
      chains,
      appName,
    }),
    //injected({ chains }),
  ];

  return connectors.map((c) => {
    return { ...c.createConnector(), ...c };
  });
};
