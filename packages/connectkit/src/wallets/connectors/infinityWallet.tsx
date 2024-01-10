import { LegacyWalletProps } from './../wallet';

import Logos from './../../assets/logos';

import { isInfinityWallet } from '../../utils/wallets';

export const infinityWallet = (): LegacyWalletProps => {
  const isInstalled = isInfinityWallet();

  return {
    id: 'infinityWallet',
    name: 'Infinity Wallet',
    icon: <Logos.InfinityWallet />,
    scannable: false,
    downloadUrls: {
      download: 'https://infinitywallet.io/download',
      website: 'https://infinitywallet.io/download',
      chrome: 'https://infinitywallet.io/download',
      firefox: 'https://infinitywallet.io/download',
      brave: 'https://infinitywallet.io/download',
      edge: 'https://infinitywallet.io/download',
    },
    installed: Boolean(isInstalled),
  };
};
