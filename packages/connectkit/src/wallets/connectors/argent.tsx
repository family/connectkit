import { WalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const argent = (): WalletProps => {
  return {
    id: 'argent',
    name: 'Argent',
    logos: {
      default: <Logos.Argent />,
    },
    logoBackground: '#fff',
    scannable: true,
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
