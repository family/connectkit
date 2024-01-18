import { type CreateConnectorFn } from 'wagmi';
import { type CreateConfigParameters } from '@wagmi/core';
import { type Chain, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { type HttpTransport, http } from 'viem';

import defaultConnectors from './defaultConnectors';

const getTransport = (
  provider: string,
  apiKey: string,
  chain: Chain
): HttpTransport => {
  const chainName = chain.name.toLowerCase();
  switch (provider) {
    case 'alchemy':
      return http(`https://${chainName}.g.alchemy.com/v2/${apiKey}`);
    case 'infura':
      return http(`https://${chainName}.infura.io/v3/${apiKey}`);
    default: // public
      return http();
  }
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

  /* WC 2.0 requires a project ID (get one here: https://cloud.walletconnect.com/sign-in) */
  walletConnectProjectId: string;
  alchemyApiKey?: string;
  infuraApiKey?: string;
};

const defaultConfig = ({
  appName = 'ConnectKit',
  appIcon,
  appDescription,
  appUrl,
  chains = [mainnet, polygon, optimism, arbitrum],
  connectors,
  walletConnectProjectId,
  alchemyApiKey,
  infuraApiKey,
}: DefaultConfigProps): CreateConfigParameters => {
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const transports: CreateConfigParameters['transports'] = {};
  Object.keys(chains).forEach((key, index) => {
    const chain = chains[index];
    transports[chain.id] = alchemyApiKey
      ? getTransport('alchemy', alchemyApiKey, chain)
      : infuraApiKey
      ? getTransport('infura', infuraApiKey, chain)
      : http();
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
