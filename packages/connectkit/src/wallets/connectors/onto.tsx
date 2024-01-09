import { LegacyWalletProps } from './../wallet';

import { isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const onto = (): LegacyWalletProps => {
  return {
    id: 'onto',
    name: 'ONTO',
    icon: <Logos.ONTO />,
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/onto',
      ios: 'https://apps.apple.com/app/onto-an-ontology-dapp/id1436009823',
      android:
        'https://play.google.com/store/apps/details?id=com.github.ontio.onto',
      website: 'https://onto.app/en/download/',
    },
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://onto.app/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
