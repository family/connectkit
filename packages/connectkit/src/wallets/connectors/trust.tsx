import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

import { isTrust } from '../../utils/wallets';

export const trust = (): LegacyWalletProps => {
  const isInstalled = isTrust();
  return {
    id: 'trust',
    name: 'Trust Wallet',
    shortName: 'Trust',
    icon: <Logos.Trust />,
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/trust',
      android:
        'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
    },
    installed: isInstalled,
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
