import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const frontier = (): WalletProps => {
  return {
    id: 'frontier',
    name: 'Frontier',
    logos: {
      default: <Logos.Frontier />,
    },
    logoBackground: '#CC703C',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/frontier',
      ios: 'https://apps.apple.com/app/frontier-crypto-defi-wallet/id1482380988',
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet',
      website: 'https://frontier.xyz/',
    },
    createUri: (uri: string) => {
      return isAndroid() ? uri : `frontier://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
