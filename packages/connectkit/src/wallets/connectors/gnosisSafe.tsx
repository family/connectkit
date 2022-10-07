import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const gnosisSafe = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'gnosisSafe',
    name: 'Gnosis Safe',
    shortName: 'Safe',
    logos: {
      default: <Logos.GnosisSafe />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/gnosisSafe',
      ios: 'https://apps.apple.com/app/id1515759131',
      android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
      website: 'https://gnosis-safe.io/',
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
              : `https://gnosis-safe.io/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
