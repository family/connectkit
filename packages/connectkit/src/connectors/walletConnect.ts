import {
  walletConnect as wagmiWalletConnect,
  type WalletConnectParameters,
} from 'wagmi/connectors/walletConnect';

import { registerWalletConnectFactory } from './registry';
import { ConnectKitConnector } from './types';

export type { WalletConnectParameters };

/**
 * WalletConnect connector.
 * Requires the `@walletconnect/ethereum-provider` package to be installed.
 *
 * The project id defaults to `walletConnectProjectId` passed to
 * getDefaultConfig, and app metadata defaults to the config-level app
 * details; options passed here take precedence.
 */
export const walletConnect = (
  parameters?: Partial<WalletConnectParameters>
): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'walletConnect',
  createConnector: (ctx) => {
    // Make the wagmi factory available to features that spawn additional
    // WalletConnect connectors at runtime (e.g. useWalletConnectModal)
    // without pulling the SDK into the main bundle.
    registerWalletConnectFactory(wagmiWalletConnect);

    const projectId = parameters?.projectId ?? ctx.walletConnectProjectId;
    if (!projectId) {
      // Matches the historical behavior of getDefaultConfig, which omitted
      // the WalletConnect connector when no project id was configured.
      console.warn(
        '[ConnectKit] The WalletConnect connector requires a project id (get one here: https://cloud.reown.com/sign-in). Pass it via walletConnect({ projectId }) or getDefaultConfig({ walletConnectProjectId }). The connector has been omitted.'
      );
      return null;
    }

    const { name, description, url, icon } = ctx.app;
    const hasAllAppData = name && icon && description && url;

    return wagmiWalletConnect({
      showQrModal: false,
      metadata: hasAllAppData
        ? {
            name,
            description: description!,
            url: url!,
            icons: [icon!],
          }
        : undefined,
      ...parameters,
      projectId,
    });
  },
});
