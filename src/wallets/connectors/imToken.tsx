import { WalletProps } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isMobile } from '../../utils';
import Logos from './../../assets/logos';

export const imToken = ({ chains }): WalletProps => {
  const isInstalled = false; // Does not have a browser injector
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'imToken',
    name: 'imToken',
    logos: {
      default: <Logos.ImToken />,
    },
    logoBackground: '#098de6',
    scannable: false,
    downloadUrls: {
      //website: 'https://support.token.im/hc/en-us/categories/360000925393',
      download: 'https://connect.family.co/v0/download/imToken',
      android: 'https://play.google.com/store/apps/details?id=im.token.app',
      ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
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
