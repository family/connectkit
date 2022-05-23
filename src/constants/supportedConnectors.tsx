/**
 *
 * TODO:
 * Move this into a structure to allow usage of WAGMI
 * or keep this file isolated for the other useful config data
 *
 */

import logos from './../assets/logos';
let supportedConnectors: {
  id: string;
  name: string;
  logo: any;
  scannable: boolean;
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

  // TODO: Define types
  supportedConnectors = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      logo: logos.MetaMask,
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
        android: 'https://play.google.com/store/apps/details?id=io.metamask',
        ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
        download: 'https://connect.family.co/download/metamask',
      } as IDictionary,
      extensionIsInstalled: () => {
        return Boolean(ethereum && ethereum.isMetaMask);
      },
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      logo: logos.WalletConnect,
      scannable: true,
      defaultConnect: () => {},
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      logo: logos.Coinbase,
      scannable: true,
      //defaultConnect: () => {},
      extensions: {
        chrome:
          'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
      } as IDictionary,
      appUrls: {
        android: 'https://play.google.com/store/apps/details?id=org.toshi',
        ios: 'https://apps.apple.com/us/app/coinbase-wallet-store-crypto/id1278383455',
        download: 'https://connect.family.co/download/coinbasewallet',
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
