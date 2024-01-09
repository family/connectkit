import { LegacyWalletProps } from './../wallet';

import Logos from './../../assets/logos';

import { isAndroid, isMobile } from '../../utils';
import { isRainbow } from '../../utils/wallets';

export const rainbow = (): LegacyWalletProps => {
  const isInstalled = isRainbow();
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'rainbow',
    name: 'Rainbow',
    icon: <Logos.Rainbow />,
    scannable: false,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/rainbow',
      website: 'https://rainbow.me/?utm_source=connectkit',
      android:
        'https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Dconnectkit&utm_source=connectkit',
      ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021?pt=119997837&ct=connectkit&mt=8',
      chrome: 'https://rainbow.me/extension?utm_source=connectkit',
      edge: 'https://rainbow.me/extension?utm_source=connectkit',
      brave: 'https://rainbow.me/extension?utm_source=connectkit',
    },
    installed: !shouldUseWalletConnect ? isInstalled : undefined,
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://rnbwapp.com/wc?uri=${encodeURIComponent(
            uri
          )}&connector=connectkit`;
    },
  };
};
