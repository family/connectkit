import Logos from '../assets/logos';

/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 */
export type WalletConfigProps = {
  // Reverse domain name system identifier
  rdns?: string;
  // Wallets name
  name?: string;
  // Wallets short name. Defaults to `name`
  shortName?: string;
  // Icon to display in the modal
  icon?: string | React.ReactNode;
  // Icon to use on the wallet list button. If not provided, `icon` will be used
  iconConnector?: React.ReactNode;
  // Hex color or gradient
  iconBackground?: string;
  // Defaults to `'circle'`, but some icons look better as squircle (e.g. if they have a background)
  iconShape?: 'squircle' | 'circle';
  // Defaults to `false`, but some icons don't have a background and look better if they shrink to fit the container
  iconShouldShrink?: boolean;
  // Links to download the wallet
  downloadUrls?: {
    // Download redirect, hosted by Family.co
    // This URL redirects to the correct download URL based on the user's device
    // Note: this will eventually be automated by the below data
    download?: string;
    // wallet's website
    website?: string;
    // app downloads
    desktop?: string;
    android?: string;
    ios?: string;
    // browser extensions
    chrome?: string;
    firefox?: string;
    brave?: string;
    edge?: string;
    safari?: string;
  };
};

// Organised in alphabetical order by key
export const walletConfigs: { [key: string]: WalletConfigProps } = {
  coinbaseWallet: {
    rdns: 'com.coinbase.wallet',
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
    icon: <Logos.Coinbase background />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/coinbasewallet',
      website: 'https://www.coinbase.com/wallet/getting-started-extension',
      android: 'https://play.google.com/store/apps/details?id=org.toshi',
      ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
      chrome:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',
    },
  },
  crypto: {
    rdns: 'com.crypto.wallet',
    name: 'Crypto.com',
    shortName: 'Crypto',
  },
  frame: {
    name: 'Frame',
    icon: <Logos.Frame />,
    iconBackground: '#fff',
    iconShouldShrink: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/frame',
      website: 'https://frame.sh',
      chrome:
        'https://chrome.google.com/webstore/detail/frame-companion/ldcoohedfbjoobcadoglnnmmfbdlmmhf',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/frame-extension',
      brave:
        'https://chrome.google.com/webstore/detail/frame-companion/ldcoohedfbjoobcadoglnnmmfbdlmmhf',
    },
  },
  injected: {
    name: 'Browser Wallet',
    shortName: 'Browser',
    icon: <Logos.Injected />,
  },
  metaMask: {
    name: 'MetaMask',
    icon: <Logos.MetaMask />,
    iconConnector: <Logos.MetaMask />,
    iconBackground:
      'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
    iconShouldShrink: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/metamask',
      website: 'https://metamask.io/download/',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
    },
  },
  phantom: {
    rdns: 'app.phantom',
    name: 'Phantom',
    iconShape: 'squircle',
  },
  rainbow: {
    rdns: 'me.rainbow',
    name: 'Rainbow Wallet',
    shortName: 'Rainbow',
    iconShape: 'squircle',
  },
  rabby: {
    rdns: 'io.rabby',
    name: 'Rabby Wallet',
    shortName: 'Rabby',
  },
  safe: {
    name: 'Safe',
    icon: <Logos.GnosisSafe />,
    iconBackground: 'var(--ck-brand-gnosisSafe)',
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/safe',
      website: 'https://safe.global/wallet',
      android: 'https://play.google.com/store/apps/details?id=io.gnosis.safe',
      ios: 'https://apps.apple.com/app/id1515759131',
    },
  },
  talisman: {
    rdns: 'xyz.talisman',
    name: 'Talisman',
    shortName: 'Talisman',
    iconShape: 'squircle',
  },
  trustWallet: {
    rdns: 'com.trustwallet.app',
    name: 'Trust Wallet',
    shortName: 'Trust',
    iconShouldShrink: true,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/trust',
      android:
        'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp',
      ios: 'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
    },
  },
  walletConnect: {
    name: 'Other Wallets',
    shortName: 'Other',
    icon: <Logos.WalletConnect background />,
    iconConnector: <Logos.OtherWallets />,
  },
  walletConnectLegacy: {
    name: 'Other Wallets',
    shortName: 'Other',
    icon: <Logos.WalletConnectLegacy background />,
    iconConnector: <Logos.OtherWallets />,
  },
};
