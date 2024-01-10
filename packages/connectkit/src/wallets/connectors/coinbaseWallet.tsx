import { LegacyWalletProps } from './../wallet';

import { isMobile } from '../../utils';
import Logos from './../../assets/logos';

import { isCoinbaseWallet } from '../../utils/wallets';

export const coinbaseWallet = (): LegacyWalletProps => {
  const isInstalled = isCoinbaseWallet();
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
    icon: <Logos.Coinbase />,
    scannable: true,
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/coinbasewallet',
      website: 'https://www.coinbase.com/wallet/getting-started-extension',
      android: 'https://play.google.com/store/apps/details?id=org.toshi',
      ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
      chrome:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    },
    createUri: (uri: string) => {
      return `https://go.cb-w.com/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
