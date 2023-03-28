/**
 *
 * TODO:
 * Move this into a structure to allow usage of WAGMI
 * or keep this file isolated for the other useful config data
 *
 */

import { ReactNode } from 'react';
import Logos from './../assets/logos';
import { isMetaMask } from './../utils';

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
    mobile?: ReactNode;
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
      shortName: 'Browser',
      logos: {
        default: <Logos.Injected />,
        mobile: (
          <div
            style={{
              padding: 5,
              background: 'var(--ck-body-background-tertiary)',
              borderRadius: '27%',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div
              style={{
                transform: 'scale(0.75)',
                position: 'relative',
                width: '100%',
              }}
            >
              <Logos.Injected />
            </div>
          </div>
        ),
        transparent: <Logos.Injected />,
      },
      scannable: false,
      extensionIsInstalled: () => {
        return Boolean(ethereum);
      },
    },
    {
      id: 'walletConnect',
      name: 'Other Wallets',
      shortName: 'Other',
      logos: {
        default: <Logos.WalletConnect />,
        mobile: (
          <div
            style={{
              padding: 5,
              background: 'var(--ck-body-background-secondary)',
              borderRadius: '21%',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Logos.OtherWallets />
          </div>
        ),
        transparent: <Logos.WalletConnect background={false} />,
        connectorButton: <Logos.OtherWallets />,
        qrCode: <Logos.WalletConnect background={true} />,
      },
      logoBackground: 'var(--ck-brand-walletConnect)',
      scannable: true,
      defaultConnect: () => {},
    },
    {
      id: 'walletConnectLegacy',
      name: 'Other Wallets',
      shortName: 'Other',
      logos: {
        default: <Logos.WalletConnectLegacy />,
        mobile: (
          <div
            style={{
              padding: 5,
              background: 'var(--ck-body-background-secondary)',
              borderRadius: '21%',
              boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Logos.OtherWallets />
          </div>
        ),
        transparent: <Logos.WalletConnectLegacy background={false} />,
        connectorButton: <Logos.OtherWallets />,
        qrCode: <Logos.WalletConnectLegacy background={true} />,
      },
      logoBackground: 'var(--ck-brand-walletConnect)',
      scannable: true,
      defaultConnect: () => {},
    },
    {
      id: 'metaMask',
      name: 'MetaMask',
      logos: {
        default: <Logos.MetaMask background />,
        mobile: <Logos.MetaMask background />,
        transparent: (
          <div
            style={{
              transform: 'scale(0.86)',
              position: 'relative',
              width: '100%',
            }}
          >
            <Logos.MetaMask />
          </div>
        ),
        connectorButton: (
          <div
            style={{
              transform: 'scale(1.1)',
            }}
          >
            <Logos.MetaMask />
          </div>
        ),
      },
      logoBackground:
        'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
      scannable: false,
      // defaultConnect:  () => {},
      extensions: {
        chrome:
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        firefox:
          'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
        brave:
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
      } as IDictionary,
      appUrls: {
        download: 'https://connect.family.co/v0/download/metamask',
        website: 'https://metamask.io/download/',
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
        ios: 'https://apps.apple.com/app/metamask/id1438144202',
      } as IDictionary,
      extensionIsInstalled: () => {
        return isMetaMask();
      },
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      shortName: 'Coinbase',
      logos: {
        default: <Logos.Coinbase />,
        mobile: <Logos.Coinbase background />,
        transparent: <Logos.Coinbase background={false} />,
        appIcon: <Logos.Coinbase background={false} />,
        connectorButton: <Logos.Coinbase background={true} />,
        //connectorButton: <Logos.CoinbaseImage />,
        qrCode: <Logos.Coinbase background={true} />,
      },
      logoBackground: 'var(--ck-brand-coinbaseWallet)',
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
        ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
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
