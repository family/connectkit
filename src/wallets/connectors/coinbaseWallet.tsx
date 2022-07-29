import { WalletProps, WalletOptions } from './../wallet';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

import { isMobile, isCoinbaseWallet } from '../../utils';
import Logos from './../../assets/logos';

export const coinbaseWallet = ({
  chains,
  appName,
}: WalletOptions): WalletProps => {
  const isInstalled = isCoinbaseWallet();
  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
    logos: {
      default: <Logos.Coinbase />,
      mobile: <Logos.Coinbase background />,
      transparent: <Logos.Coinbase background={false} />,
      appIcon: <Logos.Coinbase background={false} />,
      connectorButton: <Logos.Coinbase background={true} />,
      qrCode: <Logos.Coinbase background={true} />,
    },
    logoBackground: 'var(--ck-brand-coinbaseWallet)',
    scannable: true,
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/coinbasewallet',
      website: 'https://www.coinbase.com/wallet/getting-started-extension',
      android: 'https://play.google.com/store/apps/details?id=org.toshi',
      ios: 'https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455',
      chrome:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    },
    createConnector: () => {
      const connector = new CoinbaseWalletConnector({
        chains,
        options: {
          appName: appName ?? '',
          headlessMode: true,
        },
      });

      const getUri = async () => (await connector.getProvider()).qrUrl;

      return {
        connector,
        qrCode: { getUri },
      };
    },
  };
};
