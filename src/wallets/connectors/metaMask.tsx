import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { isMobile, isAndroid, isMetaMask } from '../../utils';
import Logos from './../../assets/logos';

export const metaMask = ({ chains }: WalletOptions): WalletProps => {
  const isInstalled = isMetaMask();
  const shouldUseWalletConnect = isMobile() && !isInstalled;

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
      'linear-gradient(0deg, var(--brand-metamask-12), var(--brand-metamask-11))',
    scannable: false,
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
    installed: Boolean(!shouldUseWalletConnect ? isInstalled : false),
    createConnector: () => {
      const connector = shouldUseWalletConnect
        ? new WalletConnectConnector({
            chains,
            options: {
              qrcode: false,
            },
          })
        : new MetaMaskConnector({
            chains,
            options: { shimDisconnect: true },
          });

      return {
        connector,
        getUri: async () => {},
        getMobileConnector: shouldUseWalletConnect
          ? async () => {
              let connnector = connector as WalletConnectConnector;
              connector.on('error', (err) => {
                console.log('onError', err);
              });
              connector.on('message', async ({ type }) => {
                console.log('onMessage: MetaMask', type);
                if (type === 'connecting') {
                  let uriString = '';
                  try {
                    const { uri } = (await connnector.getProvider()).connector;
                    uriString = isAndroid()
                      ? uri
                      : `https://metamask.app.link/wc?uri=${encodeURIComponent(
                          uri
                        )}`;

                    window.location.href = uriString;
                  } catch {
                    console.log('catch bad URI', uriString);
                  }
                }
              });

              return connector;
            }
          : undefined,
      };
    },
  };
};
