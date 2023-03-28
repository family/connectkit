import { WalletProps } from './../wallet';

import { isMobile, isMetaMask, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const metaMask = (): WalletProps => {
  const isInstalled = isMetaMask();
  const shouldUseWalletConnect = isMobile() && !isInstalled; // use walletconnect on mobile if not using metamask in-app browser

  return {
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
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/metamask',
      website: 'https://metamask.io/download/',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/app/metamask/id1438144202',
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
    },
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    createUri: (uri: string) => {
      return isAndroid()
        ? uri
        : `https://metamask.app.link/wc?uri=${encodeURIComponent(uri)}`;
    },
  };
};
