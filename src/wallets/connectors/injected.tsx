import { WalletProps } from './../wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { isMobile } from '../../utils';
import Logos from './../../assets/logos';

export const injected = ({ chains }): WalletProps => {
  const isInstalled = typeof window !== 'undefined' && Boolean(window.ethereum);

  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'injected',
    name: 'Browser Wallet',
    shortName: 'browser',
    scannable: false,
    logos: { default: <Logos.Injected /> },
    installed: () => (!shouldUseWalletConnect ? isInstalled : undefined),
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
