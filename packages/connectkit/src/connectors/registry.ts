import { CreateConnectorFn } from 'wagmi';
import type { WalletConnectParameters } from 'wagmi/connectors/walletConnect';

/**
 * The WalletConnect SDK is an optional peer dependency, so the main bundle
 * must never import `wagmi/connectors/walletConnect` — bundlers fail on its
 * dangling `@walletconnect/ethereum-provider` import when the SDK is not
 * installed. Instead, the `connectkit/connectors/walletConnect` entry point
 * registers the wagmi factory here when the connector is created, and
 * features that need to spawn extra WalletConnect connectors (e.g. the
 * useWalletConnectModal hook) read it back at runtime.
 */
type WalletConnectFactory = (
  parameters: WalletConnectParameters
) => CreateConnectorFn;

let walletConnectFactory: WalletConnectFactory | undefined;

export const registerWalletConnectFactory = (factory: WalletConnectFactory) => {
  walletConnectFactory = factory;
};

export const getWalletConnectFactory = () => walletConnectFactory;
