import Logos from '../assets/logos';

export type WalletConfigProps = {
  rdns?: string;
  name?: string;
  shortName?: string;
  icon?: string | React.ReactNode;
  iconConnector?: React.ReactNode;
  iconBackground?: string;
  iconShape?: 'squircle' | 'circle';
  downloadUrls?: { [key: string]: string };
};

export const walletConfigs: { [key: string]: WalletConfigProps } = {
  injected: {
    name: 'Browser Wallet',
    shortName: 'Browser',
    icon: <Logos.Injected />,
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
  metaMask: {
    name: 'MetaMask',
    icon: <Logos.MetaMask />,
    iconConnector: (
      <div
        style={{
          transform: 'scale(1.1)',
        }}
      >
        <Logos.MetaMask />
      </div>
    ),
    iconBackground:
      'linear-gradient(0deg, var(--ck-brand-metamask-12), var(--ck-brand-metamask-11))',
    iconShape: 'circle',
    downloadUrls: {
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',

      download: 'https://connect.family.co/v0/download/metamask',
      website: 'https://metamask.io/download/',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
    },
  },
  coinbaseWallet: {
    name: 'Coinbase Wallet',
    shortName: 'Coinbase',
    icon: <Logos.Coinbase background />,
    downloadUrls: {
      chrome:
        'https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad',

      download: 'https://connect.family.co/v0/download/coinbasewallet',
      website: 'https://www.coinbase.com/wallet/getting-started-extension',
      android: 'https://play.google.com/store/apps/details?id=org.toshi',
      ios: 'https://apps.apple.com/app/coinbase-wallet-store-crypto/id1278383455',
    },
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
  rainbow: {
    rdns: 'me.rainbow',
    name: 'Rainbow Wallet',
    shortName: 'Rainbow',
  },
  frame: {
    name: 'Frame',
    icon: <Logos.Frame />,
    iconBackground: '#fff',
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
};
