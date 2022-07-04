import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const argent = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'argent',
    name: 'Argent',
    logos: {
      default: <Logos.Argent />,
    },
    logoBackground: '#fff',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/argent',
      android:
        'https://play.google.com/store/apps/details?id=im.argent.contractwalletclient',
      ios: 'https://apps.apple.com/us/app/argent/id1358741926',
    },
    createConnector: () => {
      const connector = new WalletConnectConnector({
        chains,
        options: {
          qrcode: false,
        },
      });

      return {
        connector,
        mobile: {
          getUri: async () => {
            const { uri } = (await connector.getProvider()).connector;

            return isAndroid()
              ? uri
              : `https://argent.link/app/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
