import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const onto = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'onto',
    name: 'ONTO',
    logos: {
      default: <Logos.ONTO />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/onto',
      ios: 'https://apps.apple.com/us/app/onto-an-ontology-dapp/id1436009823',
      android:
        'https://play.google.com/store/apps/details?id=com.github.ontio.onto',
      website: 'https://onto.app/en/download/',
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
              : `https://onto.app/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
