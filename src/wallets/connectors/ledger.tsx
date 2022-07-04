import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

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
      ios: 'https://apps.apple.com/us/app/ledger-live-web3-wallet/id1361671700',
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
              : `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        desktop: {
          getUri: async () => {
            const { uri } = (await connector.getProvider()).connector;
            return `ledgerlive://wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
