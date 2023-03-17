import { WalletProps, WalletOptions } from './../wallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { isDawn } from '../../utils';
import Logos from './../../assets/logos';

export const dawn = ({
  chains,
}: WalletOptions): WalletProps => {
  const isInstalled = isDawn();

  return {
    id: 'dawn',
    name: 'Dawn Wallet',
    shortName: 'Dawn',
    logos: {
      default: <Logos.Dawn />,
    },
    logoBackground: '#000000',
    scannable: false,
    installed: Boolean(isInstalled),
    downloadUrls: {
      download: 'https://testflight.apple.com/join/UHmOJnNy',
      website: 'https://www.dawnwallet.xyz/',
      ios: 'https://testflight.apple.com/join/UHmOJnNy',
    },
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