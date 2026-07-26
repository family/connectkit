import { CreateConnectorFn } from 'wagmi';
// wagmi v3 makes connector SDKs optional peer dependencies — import each
// connector from its own entry point so unused connectors (and their
// dangling optional imports, e.g. porto) never enter the bundle graph.
import { injected } from 'wagmi/connectors/injected';
import { walletConnect } from 'wagmi/connectors/walletConnect';
import {
  coinbaseWallet,
  type CoinbaseWalletParameters,
} from 'wagmi/connectors/coinbaseWallet';
import { safe } from 'wagmi/connectors/safe';

import {
  EthereumProviderOptions as AaveAccountOptions,
  aaveAccountConnector,
} from '@aave/account';

type DefaultConnectorsProps = {
  app: {
    name: string;
    icon?: string;
    description?: string;
    url?: string;
  };
  walletConnectProjectId?: string;
  coinbaseWalletPreference?: CoinbaseWalletParameters['preference'];
  enableAaveAccount?: boolean;
  aaveAccountOptions?: AaveAccountOptions;
};

const defaultConnectors = ({
  app,
  walletConnectProjectId,
  coinbaseWalletPreference,
  enableAaveAccount,
  aaveAccountOptions,
}: DefaultConnectorsProps): CreateConnectorFn[] => {
  const hasAllAppData = app.name && app.icon && app.description && app.url;
  const shouldUseSafeConnector =
    !(typeof window === 'undefined') && window?.parent !== window;

  const connectors: CreateConnectorFn[] = enableAaveAccount
    ? [aaveAccountConnector(aaveAccountOptions)]
    : [];

  // If we're in an iframe, include the SafeConnector
  if (shouldUseSafeConnector) {
    connectors.push(
      safe({
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      })
    );
  }

  // Add the rest of the connectors
  connectors.push(
    injected({ target: 'metaMask' }),
    coinbaseWallet({
      appName: app.name,
      appLogoUrl: app.icon,
      preference: coinbaseWalletPreference,
    })
  );

  if (walletConnectProjectId) {
    connectors.push(
      walletConnect({
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
      })
    );
  }
  /*
  connectors.push(
    injected({
      shimDisconnect: true,
    })
  );
  */

  return connectors;
};

export default defaultConnectors;
