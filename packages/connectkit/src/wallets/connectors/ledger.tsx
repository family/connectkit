import {
  WalletProps,
  WalletOptions,
  getDefaultWalletConnectConnector,
  getProviderUri,
} from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const ledger = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'ledger',
    name: 'Ledger Live',
    shortName: 'Ledger',
    logos: {
      default: <Logos.Ledger />,
    },
    logoBackground: '#000',
    scannable: false,
    downloadUrls: {
      website: 'https://www.ledger.com/ledger-live/download#download-device-2',
      download: 'https://connect.family.co/v0/download/ledger',
      android: 'https://play.google.com/store/apps/details?id=com.ledger.live',
      ios: 'https://apps.apple.com/app/ledger-live-web3-wallet/id1361671700',
    },
    createConnector: () => {
      const connector = getDefaultWalletConnectConnector(chains);

      return {
        connector,
        mobile: {
          getUri: async () => {
            const uri = await getProviderUri(connector);

            return isAndroid()
              ? uri
              : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        desktop: {
          getUri: async () => {
            const uri = await getProviderUri(connector);
            return `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => await getProviderUri(connector),
        },
      };
    },
  };
};
