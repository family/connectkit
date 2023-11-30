import { WalletProps } from '../wallet';

import Logos from '../../assets/logos';

import { isRabby } from '../../utils/wallets';

export const rabby = (): WalletProps => {
  const isInstalled = isRabby();

  return {
    id: 'rabby',
    name: 'Rabby Wallet',
    icon: <Logos.Rabby />,
    iconBackground: '#8697FF',
    scannable: false,
    downloadUrls: {
      website: 'https://rabby.io',
      chrome:
        'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    },
    installed: isInstalled,
  };
};
