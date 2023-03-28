import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const gnosisSafe = (): WalletProps => {
  return {
    id: 'gnosisSafe',
    name: 'Gnosis Safe',
    shortName: 'Safe',
    logos: {
      default: <Logos.GnosisSafe />,
    },
    logoBackground: '#ffffff',
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/gnosisSafe',
      ios: 'https://apps.apple.com/app/id1515759131',
      android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
      website: 'https://gnosis-safe.io/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://gnosis-safe.io/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
