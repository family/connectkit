import { LegacyWalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isTokenPocket } from '../../utils/wallets';

export const tokenPocket = (): LegacyWalletProps => {
  const isInstalled = isTokenPocket();

  return {
    id: 'tokenPocket',
    name: 'TokenPocket Wallet',
    icon: <Logos.TokenPocket />,
    scannable: false,
    downloadUrls: {
      website: 'https://www.tokenpocket.pro/en/download/app',
      download: 'https://www.tokenpocket.pro/en/download/app',
      android:
        'https://play.google.com/store/apps/details?id=vip.mytokenpocket',
      ios: 'https://apps.apple.com/us/app/tp-global-wallet/id6444625622',
      chrome:
        'https://chrome.google.com/webstore/detail/tokenpocket/mfgccjchihfkkindfppnaooecgfneiii',
    },
    installed: isInstalled,
  };
};
