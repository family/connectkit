import { injected } from './injected';
import { metaMask } from './metaMask';
import { walletConnect } from './walletConnect';
import { coinbaseWallet } from './coinbaseWallet';

export type WalletProps = {
  id: string;
  name: string;
  logo: React.ReactNode;
  scannable?: boolean;
  installed?: boolean;
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
