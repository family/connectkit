import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

import { isFrontier } from '../../utils/wallets';

export const frontier = (): LegacyWalletProps => {
  const isInstalled = isFrontier();
  return {
    id: 'frontier',
    name: 'Frontier Wallet',
    shortName: 'Frontier',
    icon: <Logos.Frontier />,
    scannable: false,
    installed: isInstalled,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/frontier',
      ios: 'https://apps.apple.com/app/frontier-crypto-defi-wallet/id1482380988',
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet',
      website: 'https://frontier.xyz/',
      chrome:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
    createUri: (uri: string) => {
      return isAndroid() ? uri : `frontier://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
