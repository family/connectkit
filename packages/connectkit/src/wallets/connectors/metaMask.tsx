import { LegacyWalletProps } from './../wallet';

import { isMobile, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

import { isMetaMask } from '../../utils/wallets';

export const metaMask = (): LegacyWalletProps => {
  const isInstalled = isMetaMask();
  const shouldUseWalletConnect = isMobile() && !isInstalled; // use walletconnect on mobile if not using metamask in-app browser

  return {
    id: 'metaMask',
    name: 'MetaMask',
    icon: <Logos.MetaMask background />,
    iconShouldShrink: true,
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
