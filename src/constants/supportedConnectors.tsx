/**
 *
 * TODO:
 * Move this into a structure to allow usage of WAGMI
 * or keep this file isolated for the other useful config data
 *
 */

import { ReactNode } from 'react';
import Logos from './../assets/logos';

let supportedConnectors: {
  id: string;
  name?: string;
  shortName?: string;
  logos: {
    default: ReactNode;
    transparent?: ReactNode;
    connectorButton?: ReactNode;
    qrCode?: ReactNode;
    appIcon?: ReactNode;
  };
  logoBackground?: string;
  scannable?: boolean;
  extensions?: { [key: string]: string };
  appUrls?: { [key: string]: string };
  extensionIsInstalled?: () => any;
  defaultConnect?: () => any;
}[] = [];

if (typeof window != 'undefined') {
  const { ethereum } = window;

  interface IDictionary {
    [index: string]: string;
  }

  supportedConnectors = [
    {
      id: 'injected',
      name: 'Browser Wallet',
      shortName: 'browser',
      logos: { default: <Logos.Injected /> },
      scannable: false,
      extensionIsInstalled: () => {
        return Boolean(ethereum);
      },
    },
    {
      id: 'walletConnect',
      name: 'Other Wallets',
      logos: {
        default: <Logos.WalletConnect />,
        transparent: <Logos.WalletConnect background={false} />,
        connectorButton: <Logos.OtherWallets />,
        qrCode: <Logos.WalletConnectQRCode />,
      },
      logoBackground: 'var(--brand-walletConnect)',
      scannable: true,
      defaultConnect: () => {},
    },
    {
      id: 'metaMask',
      name: 'MetaMask',
      logos: {
        default: <Logos.MetaMask background />,
        transparent: <Logos.MetaMask background={false} />,
        connectorButton: <Logos.MetaMask background={false} />,
        appIcon: <Logos.MetaMask />,
      },
      logoBackground:
        'linear-gradient(0deg, var(--brand-metamask-12), var(--brand-metamask-11))',
      scannable: false,
      // defaultConnect:  () => {},
      extensions: {
        chrome:
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        firefox:
          'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
        brave:
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
      } as IDictionary,
      appUrls: {
        download: 'https://connect.family.co/v0/download/metamask',
        website: 'https://metamask.io/download/',
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
        ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
      } as IDictionary,
      extensionIsInstalled: () => {
        return Boolean(ethereum && ethereum.isMetaMask);
      },
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      shortName: 'Coinbase',
      logos: {
        default: <Logos.Coinbase />,
        transparent: <Logos.Coinbase background={false} />,
        appIcon: <Logos.Coinbase background={false} />,
        connectorButton: <Logos.Coinbase background={true} />,
        qrCode: <Logos.Coinbase background={true} />,
      },
      logoBackground: 'var(--brand-coinbaseWallet)',
      scannable: true,
      //defaultConnect: () => {},
      extensions: {
        chrome:
          'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      } as IDictionary,
      appUrls: {
        download: 'https://connect.family.co/v0/download/coinbasewallet',
        website: 'https://www.coinbase.com/wallet/getting-started-extension',
        android: 'https://play.google.com/store/apps/details?id=org.toshi',
        ios: 'https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455',
      } as IDictionary,
      extensionIsInstalled: () => {
        return Boolean(
          ethereum &&
            (ethereum?.isCoinbaseWallet ||
              (ethereum.providers &&
                ethereum.providers.find(
                  (provider) => provider.isCoinbaseWallet
                )))
        );
      },
    },
  ];
}

export default supportedConnectors;
