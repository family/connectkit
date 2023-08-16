import {
  Connector,
  configureChains,
  ChainProviderFn,
  PublicClient,
  WebSocketPublicClient,
} from 'wagmi';
import { Chain, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import defaultConnectors from './defaultConnectors';

let globalAppName: string;
let globalAppIcon: string;

export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

const defaultChains = [mainnet, polygon, optimism, arbitrum];

type DefaultConfigProps = {
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
  /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
  walletConnectProjectId: string;
};

type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  publicClient: PublicClient;
  webSocketPublicClient?: WebSocketPublicClient;
};

const defaultConfig = ({
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
  walletConnectProjectId,
}: DefaultConfigProps) => {
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
      defaultConnectors({
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

export default defaultConfig;
