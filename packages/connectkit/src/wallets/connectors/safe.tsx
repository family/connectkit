import { LegacyWalletProps } from '../wallet';

import { isAndroid } from '../../utils';
import Logos from '../../assets/logos';

export const safe = (): LegacyWalletProps => {
  return {
    id: 'safe',
    name: 'Safe',
    shortName: 'Safe',
    icon: <Logos.Safe />,
    scannable: false,
    installed: !(typeof window === 'undefined') && window?.parent !== window,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/safe',
      ios: 'https://apps.apple.com/app/id1515759131',
      android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
      website: 'https://safe.global/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://gnosis-safe.io/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
