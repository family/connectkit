import { Connector } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { SafeConnector } from 'wagmi/connectors/safe';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { createMipd } from './utils/mipd';

type DefaultConnectorsProps = {
  chains?: Chain[];
  app: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId?: string;
};

const defaultConnectors = ({
  chains,
  app,
  walletConnectProjectId,
}: DefaultConnectorsProps) => {
  const hasAllAppData = app.name && app.icon && app.description && app.url;
  const shouldUseSafeConnector =
    !(typeof window === 'undefined') && window?.parent !== window;

  let connectors: Connector[] = [];

  const mipd = createMipd();

  if (mipd) {
    connectors.push(
      ...mipd.connectors.map(
        (c) =>
          new InjectedConnector({
            chains,
            options: {
              getProvider: () =>
                typeof window !== 'undefined' ? c.provider : undefined,
              name: c.uuid, // use uuid as name so we can differentiate between multiple instances
            },
          })
      )
    );
  }

  // If we're in an iframe, include the SafeConnector
  if (shouldUseSafeConnector) {
    connectors = [
      ...connectors,
      new SafeConnector({
        chains,
        options: {
          allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
          debug: false,
        },
      }),
    ];
  }

  // Add the rest of the connectors
  connectors = [
    ...connectors,
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: app.name,
        headlessMode: true,
      },
    }),
    walletConnectProjectId
      ? new WalletConnectConnector({
          chains,
          options: {
            showQrModal: false,
            projectId: walletConnectProjectId,
            metadata: hasAllAppData
              ? {
                  name: app.name,
                  description: app.description!,
                  url: app.url!,
                  icons: [app.icon!],
                }
              : undefined,
          },
        })
      : new WalletConnectLegacyConnector({
          chains,
          options: {
            qrcode: false,
          },
        }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
      },
    }),
  ];

  return connectors;
};

export default defaultConnectors;
