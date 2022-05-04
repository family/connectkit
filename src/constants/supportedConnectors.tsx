/**
 *
 * TODO:
 * Move this into a structure to allow usage of WAGMI
 * or keep this file isolated for the other useful config data
 *
 */

import logos from './../assets/logos';

const { ethereum } = window;

interface IDictionary {
  [index: string]: string;
}
const supportedConnectors = [
  {
    id: 'injected',
    name: 'MetaMask',
    logo: logos.MetaMask,
    scannable: false,
    /*
    defaultConnect: async () => {
      //TODO: WAGMI
      alert('WAGMI connect() would go here for injected');
    },
    */
    extensions: {
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
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
    defaultConnect: async () => {
      //TODO: WAGMI
      alert('WAGMI connect() could go here for walletConnect');
    },
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    logo: logos.Coinbase,
    scannable: true,
    /*
    defaultConnect: async () => {
      //TODO: WAGMI
      alert('WAGMI connect() could go here for coinbaseWallet');
    },
    */
    extensions: {
      chrome: 'https://api.wallet.coinbase.com/rpc/v2/desktop/chrome',
    } as IDictionary,
    extensionIsInstalled: () => {
      return Boolean(
        ethereum &&
          (ethereum?.isCoinbaseWallet ||
            (ethereum.providers &&
              ethereum.providers.find((provider) => provider.isCoinbaseWallet)))
      );
    },
  },
];

export default supportedConnectors;
