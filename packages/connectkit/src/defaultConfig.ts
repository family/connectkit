import { type CreateConnectorFn, fallback, http, webSocket } from 'wagmi';
import { type CreateConfigParameters } from '@wagmi/core';
import { type Chain, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { type HttpTransport, type WebSocketTransport } from 'viem';

import defaultConnectors from './defaultConnectors';
import { chainConfigs } from './constants/chainConfigs';

const rpcUrls: {
  [key: string]: {
    [chainId: string]: string;
  };
} = {
  infura: {
    1: 'https://mainnet.infura.io/v3/',
    5: 'https://goerli.infura.io/v3/',
    11155111: 'https://sepolia.infura.io/v3/',
  },
};

const getTransport = ({
  chain,
  provider = 'public',
  apiKey,
}: {
  chain: Chain;
  provider: 'alchemy' | 'infura' | 'public';
  apiKey: string;
}): HttpTransport | WebSocketTransport => {
  const supportedChain = chainConfigs.find((c) => c.id === chain.id);
  if (supportedChain?.rpcUrls) {
    if (provider === 'alchemy') {
      if (supportedChain.rpcUrls?.alchemy?.http) {
        return http(supportedChain.rpcUrls?.alchemy?.http + apiKey);
      } else {
        return webSocket(supportedChain.rpcUrls?.alchemy?.webSocket + apiKey);
      }
    } else if (provider === 'infura') {
      if (supportedChain.rpcUrls?.infura?.http) {
        return http(supportedChain.rpcUrls?.infura?.http + apiKey);
      } else {
        return webSocket(supportedChain.rpcUrls?.infura?.webSocket + apiKey);
      }
    }
  }
  return http();
};

let globalAppName: string;
let globalAppIcon: string;

export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

type DefaultConfigProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  chains?: CreateConfigParameters['chains'];
  transports?: CreateConfigParameters['transports'];
  connectors?: CreateConnectorFn[];

  // API keys
  alchemyId?: string;
  infuraId?: string;
  // WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in)
  walletConnectProjectId: string;
};

const defaultConfig = ({
  appName = 'ConnectKit',
  appIcon,
  appDescription,
  appUrl,
  chains = [mainnet, polygon, optimism, arbitrum],
  connectors,
  walletConnectProjectId,
  alchemyId,
  infuraId,
}: DefaultConfigProps): CreateConfigParameters => {
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const transports: CreateConfigParameters['transports'] = {};
  Object.keys(chains).forEach((key, index) => {
    const chain = chains[index];
    const urls: (HttpTransport | WebSocketTransport)[] = [];
    if (alchemyId)
      urls.push(
        getTransport({ chain, provider: 'alchemy', apiKey: alchemyId })
      );
    if (infuraId)
      urls.push(getTransport({ chain, provider: 'infura', apiKey: infuraId }));
    urls.push(http());
    transports[chain.id] = fallback(urls);
  });

  const config: CreateConfigParameters = {
    chains,
    transports,
    connectors:
      connectors ??
      defaultConnectors({
        app: {
          name: appName,
          icon: appIcon,
          description: appDescription,
          url: appUrl,
        },
        walletConnectProjectId,
      }),
  };

  return config;
};

export default defaultConfig;
