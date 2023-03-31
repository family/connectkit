import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const zerion = (): WalletProps => {
  return {
    id: 'zerion',
    name: 'Zerion',
    logos: {
      default: <Logos.Zerion />,
    },
    logoBackground: '#CC703C',
    scannable: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/zerion',
      ios: 'https://apps.apple.com/app/apple-store/id1456732565',
      android:
        'https://play.google.com/store/apps/details?id=io.zerion.android',
      website: 'https://zerion.io/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://app.zerion.io/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
