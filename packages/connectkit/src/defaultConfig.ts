import { http, CreateConnectorFn } from 'wagmi';
import { type CreateConfigParameters } from '@wagmi/core';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
// type-only import — erased at compile time, does not pull the Coinbase SDK
// into the module graph
import type { CoinbaseWalletParameters } from 'wagmi/connectors/coinbaseWallet';
import { EthereumProviderOptions as AaveAccountOptions } from '@aave/account';

import defaultConnectors, { resolveConnectors } from './defaultConnectors';
import {
  ConnectKitConnector,
  ConnectKitConnectorContext,
} from './connectors/types';

// TODO: Move these to a provider rather than global variable
let globalAppName: string;
let globalAppIcon: string;
export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

type DefaultConfigProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;

  // WalletConnect requires a project ID (get one here: https://cloud.reown.com/sign-in).
  // Only used when the walletConnect connector is included in `connectors`.
  walletConnectProjectId?: string;
  // Coinbase Wallet preference
  coinbaseWalletPreference?: CoinbaseWalletParameters['preference'];
  // Aave Account options
  enableAaveAccount?: boolean;
  aaveAccountOptions?: AaveAccountOptions;

  // Accepts ConnectKit connector descriptors (from `connectkit/connectors/*`)
  // alongside plain wagmi connectors. When omitted, defaults to the
  // dependency-free set: Aave Account + MetaMask (injected).
  connectors?: (ConnectKitConnector | CreateConnectorFn)[];
} & Partial<Omit<CreateConfigParameters, 'connectors'>>;

const defaultConfig = ({
  appName = 'ConnectKit',
  appIcon,
  appDescription,
  appUrl,
  walletConnectProjectId,
  coinbaseWalletPreference,
  chains = [mainnet, polygon, optimism, arbitrum],
  client,
  enableAaveAccount = true,
  aaveAccountOptions,
  connectors: providedConnectors,
  ...props
}: DefaultConfigProps): CreateConfigParameters => {
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const ctx: ConnectKitConnectorContext = {
    app: {
      name: appName,
      icon: appIcon,
      description: appDescription,
      url: appUrl,
    },
    walletConnectProjectId,
    coinbaseWalletPreference,
    aaveAccountOptions,
  };

  // TODO: nice to have, automate transports based on chains, but for now just provide public if not provided
  const transports: CreateConfigParameters['transports'] =
    props?.transports ??
    Object.fromEntries(chains.map((chain) => [chain.id, http()]));

  const connectors: CreateConfigParameters['connectors'] = providedConnectors
    ? resolveConnectors(providedConnectors, ctx)
    : defaultConnectors({ ctx, enableAaveAccount });

  const config: CreateConfigParameters<any, any> = {
    ...props,
    chains,
    connectors,
    transports,
  };

  return config;
};

export default defaultConfig;
