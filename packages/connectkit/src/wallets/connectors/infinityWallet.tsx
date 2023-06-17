import { WalletProps } from './../wallet';

import { isMobile, isInfinityWallet, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const infinityWallet = (): WalletProps => {
  const isInstalled = isInfinityWallet();
  const shouldUseWalletConnect = isMobile || !isInstalled; // use walletconnect on mobile or if on desktop but not installed

  return {
    id: 'infinityWallet',
    name: 'Infinity Wallet Test',
    logos: {
      default: <Logos.InfinityWallet />,
      mobile: <Logos.InfinityWallet />,
      transparent: <Logos.InfinityWallet />,
      appIcon: <Logos.InfinityWallet />,
      connectorButton: <Logos.InfinityWallet />,
    },
    logoBackground: '#08a1d5',
    scannable: false,
    downloadUrls: {
      download: 'https://infinitywallet.io/download',
      website: 'https://infinitywallet.io/download',
      chrome: 'https://infinitywallet.io/download',
      firefox: 'https://infinitywallet.io/download',
      brave: 'https://infinitywallet.io/download',
      edge: 'https://infinitywallet.io/download',
    },
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
  };
};
