import { WalletProps } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

import { debug, isMobile, isAndroid } from '../../utils';
import Logos from './../../assets/logos';

export const metaMask = ({ chains }): WalletProps => {
  const isInstalled =
    typeof window !== 'undefined' && window.ethereum?.isMetaMask;

  const shouldUseWalletConnect = isMobile() && !isInstalled;

  debug('isInstalled', isInstalled);
  debug('shouldUseWalletConnect', shouldUseWalletConnect);

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
    installed: () => (!shouldUseWalletConnect ? isInstalled : undefined),
    createConnector: () => {
      debug('shouldUseWalletConnect', shouldUseWalletConnect);
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
        getMobileConnector: shouldUseWalletConnect
          ? async () => {
              let connnector = connector as WalletConnectConnector;
              connector.on('error', (err) => {
                debug('onError', err);
              });
              connector.on('message', async ({ type }) => {
                debug('onMessage: MetaMask', type);
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
                    debug('catch bad URI', uriString);
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
