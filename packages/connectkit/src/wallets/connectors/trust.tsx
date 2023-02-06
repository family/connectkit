import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const trust = (): WalletProps => {
  return {
    id: 'trust',
    name: 'Trust Wallet',
    shortName: 'Trust',
    logos: {
      default: <Logos.Trust />,
    },
    logoBackground: '#fff',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/trust',
      android:
        'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
