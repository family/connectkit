import { LegacyWalletProps } from './../wallet';

import Logos from './../../assets/logos';

export const imToken = (): LegacyWalletProps => {
  return {
    id: 'imToken',
    name: 'imToken',
    icon: <Logos.ImToken />,
    scannable: false,
    downloadUrls: {
      //website: 'https://support.token.im/hc/en-us/categories/360000925393',
      download: 'https://connect.family.co/v0/download/imToken',
      android: 'https://play.google.com/store/apps/details?id=im.token.app',
      ios: 'https://itunes.apple.com/us/app/imtoken2/id1384798940',
    },
    createUri: (uri: string) => {
      return `imtokenv2://wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
