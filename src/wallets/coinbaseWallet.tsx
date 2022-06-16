import { WalletProps } from './wallet';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

import Logos from './../assets/logos';

export const coinbaseWallet = ({ chains, appName }): WalletProps => {
  const isInstalled =
    typeof window !== 'undefined' &&
    !!(
      window.ethereum?.isCoinbaseWallet ||
      (window.ethereum?.providers &&
        window.ethereum?.providers.find(
          (provider) => provider.isCoinbaseWallet
        ))
    );

  return {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    logo: <Logos.Coinbase />,
    scannable: true,
    installed: isInstalled,
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
          appName,
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
