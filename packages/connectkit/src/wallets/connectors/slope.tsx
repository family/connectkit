import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const slope = (): LegacyWalletProps => {
  return {
    id: 'slope',
    name: 'Slope',
    icon: <Logos.Slope />,
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/slope',
      ios: 'https://apps.apple.com/app/slope-wallet/id1574624530',
      android: 'https://play.google.com/store/apps/details?id=com.wd.wallet',
      chrome:
        'https://chrome.google.com/webstore/detail/slope-wallet/pocmplpaccanhmnllbbkpgfliimjljgo',
      website: 'https://slope.finance/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://slope.finance/app/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
