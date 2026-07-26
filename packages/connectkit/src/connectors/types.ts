import { CreateConnectorFn } from 'wagmi';
// type-only import — erased at compile time, does not pull the Coinbase SDK
// into the module graph
import type { CoinbaseWalletParameters } from 'wagmi/connectors/coinbaseWallet';
import type { EthereumProviderOptions as AaveAccountOptions } from '@aave/account';

/**
 * App-level options that getDefaultConfig passes down to ConnectKit connector
 * factories, so options like the app name or the WalletConnect project id only
 * need to be set once at the config level.
 */
export type ConnectKitConnectorContext = {
  app: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId?: string;
  coinbaseWalletPreference?: CoinbaseWalletParameters['preference'];
  aaveAccountOptions?: AaveAccountOptions;
};

/**
 * A connector descriptor returned by the factories under
 * `connectkit/connectors/*`. getDefaultConfig resolves it into a wagmi
 * connector, injecting the app-level context.
 */
export type ConnectKitConnector = {
  readonly _ckConnector: true;
  readonly id: string;
  /** Returns the wagmi connector, or null when the connector does not apply
   * to the current environment (e.g. safe outside of an app frame). */
  createConnector: (
    ctx: ConnectKitConnectorContext
  ) => CreateConnectorFn | null;
};

export const isConnectKitConnector = (
  value: unknown
): value is ConnectKitConnector =>
  typeof value === 'object' && value !== null && '_ckConnector' in value;
