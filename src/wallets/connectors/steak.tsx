import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isMobile, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const steak = ({ chains }: WalletOptions): WalletProps => {
  const isInstalled = false; // Does not have a browser injector
  const shouldUseWalletConnect = isMobile() && !isInstalled;

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
      ios: 'https://apps.apple.com/np/app/steakwallet/id1569375204',
      website: 'https://steakwallet.fi/download',
    },
    installed: () => Boolean(!shouldUseWalletConnect ? isInstalled : false),
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
              : `https://links.steakwallet.fi/wc?uri=${encodeURIComponent(
                  uri
                )}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
