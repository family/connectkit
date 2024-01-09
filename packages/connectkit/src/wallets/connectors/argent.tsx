import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const argent = (): LegacyWalletProps => {
  return {
    id: 'argent',
    name: 'Argent',
    icon: <Logos.Argent />,
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/argent',
      android:
        'https://play.google.com/store/apps/details?id=im.argent.contractwalletclient',
      ios: 'https://apps.apple.com/app/argent/id1358741926',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://argent.link/app/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
