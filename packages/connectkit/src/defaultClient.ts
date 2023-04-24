import {
  Connector,
  configureChains,
  ChainProviderFn,
  PublicClient,
  WebSocketPublicClient,
} from 'wagmi';
import { Chain, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { SafeConnector } from 'wagmi/connectors/safe';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

let globalAppName: string;
let globalAppIcon: string;

export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

const defaultChains = [mainnet, polygon, optimism, arbitrum];

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

type DefaultClientProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  autoConnect?: boolean;
  alchemyId?: string;
  infuraId?: string;
  chains?: Chain[];
  connectors?: any;
  publicClient?: any;
  webSocketPublicClient?: any;
  enableWebSocketPublicClient?: boolean;
  stallTimeout?: number;
  // WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in)
  // @TODO: Enable this feature – Using WC 1.0 for now (2.0 is not supported by all wallets)
  //walletConnectProjectId?: string;
};

type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  publicClient: PublicClient;
  webSocketPublicClient?: WebSocketPublicClient;
};

const getDefaultConnectors = ({
  chains,
  app,
  walletConnectProjectId,
}: DefaultConnectorsProps) => {
  const hasAllAppData = app.name && app.icon && app.description && app.url;
  const shouldUseSafeConnector =
    !(typeof window === 'undefined') && window?.parent !== window;

  let connectors: Connector[] = [];

  // If we're in an iframe, use the SafeConnector
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

const defaultClient = ({
  autoConnect = true,
  appName = 'ConnectKit',
  appIcon,
  appDescription,
  appUrl,
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  publicClient,
  stallTimeout,
  webSocketPublicClient,
  enableWebSocketPublicClient,
}: //walletConnectProjectId, // prettier formatting weird here, but this for WC 2.0
DefaultClientProps) => {
  const walletConnectProjectId = undefined; // @TODO: Enable for WC 2.0

  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const providers: ChainProviderFn[] = [];
  if (alchemyId) {
    providers.push(alchemyProvider({ apiKey: alchemyId }));
  }
  if (infuraId) {
    providers.push(infuraProvider({ apiKey: infuraId }));
  }
  providers.push(
    jsonRpcProvider({
      rpc: (c) => {
        return { http: c.rpcUrls.default.http[0] };
      },
    })
  );
  providers.push(publicProvider());

  const {
    publicClient: configuredPublicClient,
    chains: configuredChains,
    webSocketPublicClient: configuredWebSocketPublicClient,
  } = configureChains(chains, providers, { stallTimeout });

  const connectKitClient: ConnectKitClientProps = {
    autoConnect,
    connectors:
      connectors ??
      getDefaultConnectors({
        chains: configuredChains,
        app: {
          name: appName,
          icon: appIcon,
          description: appDescription,
          url: appUrl,
        },
        walletConnectProjectId,
      }),
    publicClient: publicClient ?? configuredPublicClient,
    webSocketPublicClient: enableWebSocketPublicClient // Removed by default, breaks if used in Next.js – "unhandledRejection: Error: could not detect network"
      ? webSocketPublicClient ?? configuredWebSocketPublicClient
      : undefined,
  };

  return { ...connectKitClient };
};

export default defaultClient;
