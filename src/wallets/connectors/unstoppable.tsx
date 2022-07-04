import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const unstoppable = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'unstoppable',
    name: 'Unstoppable',
    logos: {
      default: <Logos.Unstoppable />,
    },
    logoBackground: 'linear-gradient(180deg, #FED812 0%, #FFAF00 100%)',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/unstoppable',
      ios: 'https://apps.apple.com/app/bank-bitcoin-wallet/id1447619907',
      android:
        'https://play.google.com/store/apps/details?id=io.horizontalsystems.bankwallet',
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
              : `https://unstoppable.money/wc?uri=${encodeURIComponent(uri)}`;
          },
        },
        qrCode: {
          getUri: async () => (await connector.getProvider()).connector.uri,
        },
      };
    },
  };
};
