import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const slope = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'slope',
    name: 'Slope',
    logos: {
      default: <Logos.Slope />,
    },
    logoBackground: '#6C67F1',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/slope',
      ios: 'https://apps.apple.com/app/slope-wallet/id1574624530',
      android: 'https://play.google.com/store/apps/details?id=com.wd.wallet',
      chrome:
        'https://chrome.google.com/webstore/detail/slope-wallet/pocmplpaccanhmnllbbkpgfliimjljgo',
      website: 'https://slope.finance/',
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
              : `https://slope.finance/app/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
