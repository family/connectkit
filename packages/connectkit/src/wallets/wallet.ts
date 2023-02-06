import { ReactNode } from 'react';
import { Chain } from 'wagmi';

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
  createUri?: (uri: string) => string;
};
