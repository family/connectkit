import { CreateConnectorFn } from 'wagmi';

import { aaveAccount } from './connectors/aaveAccount';
import { metaMask } from './connectors/metaMask';
import {
  ConnectKitConnector,
  ConnectKitConnectorContext,
  isConnectKitConnector,
} from './connectors/types';

/**
 * Resolves a mixed list of ConnectKit connector descriptors and plain wagmi
 * connectors into the `CreateConnectorFn[]` that wagmi's createConfig expects.
 * Descriptors returning null (e.g. safe outside of an app frame) are omitted.
 */
export const resolveConnectors = (
  connectors: (ConnectKitConnector | CreateConnectorFn)[],
  ctx: ConnectKitConnectorContext
): CreateConnectorFn[] =>
  connectors
    .map((connector) =>
      isConnectKitConnector(connector) ? connector.createConnector(ctx) : connector
    )
    .filter((connector): connector is CreateConnectorFn => connector != null);

type DefaultConnectorsProps = {
  ctx: ConnectKitConnectorContext;
  enableAaveAccount?: boolean;
};

/**
 * The default connector set contains only connectors with no additional
 * dependencies: Aave Account and MetaMask (injected). Connectors whose SDKs
 * are optional peer dependencies (Coinbase Wallet, WalletConnect, Safe) must
 * be added explicitly via `connectkit/connectors/*`:
 *
 * ```ts
 * import { walletConnect } from 'connectkit/connectors/walletConnect';
 *
 * getDefaultConfig({
 *   walletConnectProjectId: '...',
 *   connectors: [aaveAccount(), metaMask(), walletConnect()],
 * });
 * ```
 */
const defaultConnectors = ({
  ctx,
  enableAaveAccount,
}: DefaultConnectorsProps): CreateConnectorFn[] => {
  const connectors: ConnectKitConnector[] = enableAaveAccount
    ? [aaveAccount()]
    : [];

  connectors.push(metaMask());

  return resolveConnectors(connectors, ctx);
};

export default defaultConnectors;
