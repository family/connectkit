import { WalletProps } from './../wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Logos from './../../assets/logos';

export const brave = ({ chains }): WalletProps => {
  const isInstalled =
    typeof window !== 'undefined' && window.ethereum?.isBraveWallet === true;

  return {
    id: 'brave',
    name: 'Brave Wallet',
    shortName: 'Brave',
    logos: {
      default: <Logos.Brave />,
    },
    logoBackground: '#fff',
    scannable: false,
    downloadUrls: {},
    installed: () => isInstalled,
    createConnector: () => {
      return {
        connector: new InjectedConnector({
          chains,
          options: { shimDisconnect: true },
        }),
      };
    },
  };
};
