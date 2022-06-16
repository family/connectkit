import { WalletProps } from './wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { isMobile } from '../utils';
import Logos from './../assets/logos';

export const metaMask = ({ chains }): WalletProps => {
  const isInstalled =
    typeof window !== 'undefined' && window.ethereum?.isMetaMask;

  const shouldUseWalletConnect = isMobile() && !isInstalled;

  return {
    id: 'metaMask',
    name: 'MetaMask',
    logo: <Logos.MetaMask />,
    scannable: false,
    installed: !shouldUseWalletConnect ? isInstalled : undefined,
    downloadUrls: {
      download: 'https://connect.family.co/v0/download/metamask',
      website: 'https://metamask.io/download/',
      android: 'https://play.google.com/store/apps/details?id=io.metamask',
      ios: 'https://apps.apple.com/us/app/metamask/id1438144202',
      chrome:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
      brave:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
    },
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? new WalletConnectConnector({
            chains,
            options: {
              qrcode: false,
              //rpc,
            },
          })
        : new MetaMaskConnector({
            chains,
            options: { shimDisconnect: true },
          });

      return {
        connector,
        mobile: {
          getUri: shouldUseWalletConnect
            ? async () => {
                // @ts-ignore
                const { uri } = (await connector.getProvider()).connector;
                return uri;
              }
            : undefined,
        },
      };
    },
  };
};
