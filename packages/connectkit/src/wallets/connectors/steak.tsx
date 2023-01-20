import {
  WalletProps,
  WalletOptions,
  getProviderUri,
  getDefaultWalletConnectConnector,
} from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const steak = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'steak',
    name: 'Steak',
    logos: {
      default: <Logos.Steak />,
    },
    logoBackground: '#000000',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/steak',
      android:
        'https://play.google.com/store/apps/details?id=fi.steakwallet.app',
      ios: 'https://apps.apple.com/app/steakwallet/id1569375204',
      website: 'https://steakwallet.fi/download',
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
              : `https://links.steakwallet.fi/wc?uri=${encodeURIComponent(
                  uri
                )}`;
          },
        },
        qrCode: {
          getUri: async () => await getProviderUri(connector),
        },
      };
    },
  };
};
