import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const rainbow = (): WalletProps => {
  return {
    id: 'rainbow',
    name: 'Rainbow',
    logos: {
      default: <Logos.Rainbow />,
    },
    logoBackground: '#174299',
    // gradient: 'linear-gradient(180deg, #174299 0%, #001E59 100%)',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/rainbow',
      website: 'https://rainbow.me',
      android: 'https://play.google.com/store/apps/details?id=me.rainbow',
      ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
