import { WalletProps } from './wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import Logos from '../assets/logos';

export const injected = ({ chains }): WalletProps => {
  return {
    id: 'injected',
    name: 'Injected Wallet',
    logo: Logos.Injected,
    createConnector: () => {
      const connector = new InjectedConnector({
        chains,
        options: { shimDisconnect: true },
      });

      return {
        connector,
      };
    },
  };
};
