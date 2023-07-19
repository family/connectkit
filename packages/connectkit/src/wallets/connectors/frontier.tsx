import { WalletProps } from './../wallet';

import { isAndroid, isFrontier } from '../../utils';
import Logos from './../../assets/logos';

export const frontier = (): WalletProps => {
  const isInstalled = isFrontier();
  return {
    id: 'frontier',
    name: 'Frontier Wallet',
    logos: {
      default: <Logos.Frontier />,
    },
    shortName: 'Frontier',
    logoBackground: '#CC703C',
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
