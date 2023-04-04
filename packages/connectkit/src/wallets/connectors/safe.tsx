import { WalletProps } from '../wallet';

import { isAndroid } from '../../utils';
import Logos from '../../assets/logos';

export const safe = (): WalletProps => {
  return {
    id: 'safe',
    name: 'Safe',
    shortName: 'Safe',
    logos: {
      default: <Logos.Safe background />,
    },
    logoBackground: '#12FF80',
    scannable: true,
    installed: !(typeof window === 'undefined') && window?.parent !== window,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/safe',
      ios: 'https://apps.apple.com/app/id1515759131',
      android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
      website: 'https://gnosis-safe.io/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://safe.io/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
