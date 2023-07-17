import { WalletProps } from '../wallet';

import { isTokenPocket } from '../../utils';
import Logos from '../../assets/logos';

export const tokenPocket = (): WalletProps => {
  const isInstalled = isTokenPocket();

  return {
    id: 'tokenPocket',
    name: 'TokenPocket Wallet',
    logos: {
      default: <Logos.TokenPocket />
    },
    logoBackground: '#2980FE',
    scannable: false,
    downloadUrls: {
      website: 'https://www.tokenpocket.pro/en/download/app',
      download: 'https://www.tokenpocket.pro/en/download/app',
      android: 'https://play.google.com/store/apps/details?id=vip.mytokenpocket',
      ios: 'https://apps.apple.com/us/app/tp-global-wallet/id6444625622',
      chrome:
        'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    },
    installed: isInstalled,
  };
};
