import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import Logos from './../../assets/logos';

export const imToken = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'imToken',
    name: 'imToken',
    logos: {
      default: <Logos.PlaceHolder />,
    },
    logoBackground: '#098de6',
    scannable: false,
    downloadUrls: {
      //website: 'https://support.token.im/hc/en-us/categories/360000925393',
      download: 'https://connect.family.co/v0/download/imToken',
      android: 'https://play.google.com/store/apps/details?id=im.token.app',
      ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
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
            return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
