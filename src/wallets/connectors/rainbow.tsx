import { WalletProps } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isMobile, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const rainbow = ({ chains }): WalletProps => {
  const isInstalled = false; // Does not have a browser injector
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'rainbow',
    name: 'Rainbow',
    logos: {
      default: <Logos.Rainbow />,
    },
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/rainbow',
      website: 'https://rainbow.me',
      android: 'https://play.google.com/store/apps/details?id=me.rainbow',
      ios: 'https://apps.apple.com/us/app/rainbow-ethereum-wallet/id1457119021',
    },
    installed: () => (!shouldUseWalletConnect ? isInstalled : undefined),
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
              : `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
