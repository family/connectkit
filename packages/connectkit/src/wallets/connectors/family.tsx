import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

import { isFamily } from '../../utils/wallets';

export const family = (): LegacyWalletProps => {
  const isInstalled = isFamily();
  return {
    id: 'family',
    name: 'Family',
    icon: <Logos.Family />,
    iconShape: 'squircle',
    installed: Boolean(isInstalled) ? true : undefined,
    scannable: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/family',
      ios: 'https://family.co/download',
      website: 'https://family.co',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `familywallet://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
