import {
  WalletProps,
  WalletOptions,
  getDefaultWalletConnectConnector,
  getProviderUri,
} from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const zerion = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'zerion',
    name: 'Zerion',
    logos: {
      default: <Logos.Zerion />,
    },
    logoBackground: '#CC703C',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/zerion',
      ios: 'https://apps.apple.com/app/apple-store/id1456732565',
      android:
        'https://play.google.com/store/apps/details?id=io.zerion.android',
      website: 'https://zerion.io/',
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
              : `https://app.zerion.io/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => await getProviderUri(connector),
        },
      };
    },
  };
};
