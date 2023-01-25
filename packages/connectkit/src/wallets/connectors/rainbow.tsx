import {
  WalletProps,
  WalletOptions,
  getDefaultWalletConnectConnector,
  getProviderUri,
} from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const rainbow = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'rainbow',
    name: 'Rainbow',
    logos: {
      default: <Logos.Rainbow />,
    },
    logoBackground: '#174299',
    // gradient: 'linear-gradient(180deg, #174299 0%, #001E59 100%)',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/rainbow',
      website: 'https://rainbow.me',
      android: 'https://play.google.com/store/apps/details?id=me.rainbow',
      ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021',
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
              : `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => await getProviderUri(connector),
        },
      };
    },
  };
};
