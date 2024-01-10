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
  argent: {
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/argent',
      android:
        'https://play.google.com/store/apps/details?id=im.argent.contractwalletclient',
      ios: 'https://apps.apple.com/app/argent/id1358741926',
    },
  },
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
  dawn: {
    downloadUrls: {
      download:
        'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
      website: 'https://www.dawnwallet.xyz/',
      ios: 'https://apps.apple.com/us/app/dawn-ethereum-wallet/id1673143782',
    },
  },
  family: {
    rdns: 'co.family.wallet',
    name: 'Family',
    shortName: 'Family',
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/family',
      website: 'https://family.co',
      ios: 'https://family.co/download',
    },
  },
  frame: {
    name: 'Frame',
    icon: <Logos.Frame />,
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
  frontier: {
    name: 'Frontier Wallet',
    shortName: 'Frontier',
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/frontier',
      ios: 'https://apps.apple.com/app/frontier-crypto-defi-wallet/id1482380988',
      android:
        'https://play.google.com/store/apps/details?id=com.frontierwallet',
      website: 'https://frontier.xyz/',
      chrome:
        'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    },
  },
  injected: {
    name: 'Browser Wallet',
    shortName: 'Browser',
    icon: <Logos.Injected />,
  },
  metaMask: {
    rdns: 'io.metamask',
    name: 'MetaMask',
    icon: <Logos.MetaMask />,
    iconConnector: <Logos.MetaMask />,
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
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/rainbow',
      website: 'https://rainbow.me/?utm_source=connectkit',
      android:
        'https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Dconnectkit&utm_source=connectkit',
      ios: 'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021?pt=119997837&ct=connectkit&mt=8',
      chrome: 'https://rainbow.me/extension?utm_source=connectkit',
      edge: 'https://rainbow.me/extension?utm_source=connectkit',
      brave: 'https://rainbow.me/extension?utm_source=connectkit',
    },
  },
  rabby: {
    rdns: 'io.rabby',
    name: 'Rabby Wallet',
    shortName: 'Rabby',
    downloadUrls: {
      website: 'https://rabby.io',
      chrome:
        'https://chrome.google.com/webstore/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    },
  },
  safe: {
    name: 'Safe',
    icon: <Logos.Safe />,
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
    downloadUrls: {
      download: 'https://talisman.xyz/download',
      website: 'https://talisman.xyz',
      chrome:
        'https://chrome.google.com/webstore/detail/talisman-polkadot-wallet/fijngjgcjhjmmpcmkeiomlglpeiijkld',
      firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/talisman-wallet-extension/',
    },
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
