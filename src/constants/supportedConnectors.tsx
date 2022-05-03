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
    scannable: true,
    defaultConnect: async () => {
      //TODO: WAGMI
      console.log('WAGMI connect() would go here for injected');
    },
    extensions: {
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
    } as IDictionary,
    extensionIsInstalled: () => Boolean(ethereum && ethereum.isMetaMask),
  },
  {
    id: 'walletConnect',
    name: 'WalletConnect',
    logo: logos.WalletConnect,
    scannable: false,
    defaultConnect: async () => {
      //TODO: WAGMI
      console.log('WAGMI connect() could go here for walletConnect');
    },
  },
  {
    id: 'coinbaseWallet',
    name: 'Coinbase Wallet',
    logo: logos.Coinbase,
    scannable: true,
    defaultConnect: async () => {
      //TODO: WAGMI
      console.log('WAGMI connect() could go here for coinbaseWallet');
    },
    extensions: {
      chrome: 'https://api.wallet.coinbase.com/rpc/v2/desktop/chrome',
    } as IDictionary,
    extensionIsInstalled: () => Boolean(ethereum && ethereum.isCoinbaseWallet),
  },
];
export default supportedConnectors;
