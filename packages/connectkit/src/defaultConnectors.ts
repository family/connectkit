import { CreateConnectorFn } from 'wagmi';
import { Chain } from 'wagmi/chains';
import {
  injected,
  walletConnect,
  coinbaseWallet,
  safe,
} from '@wagmi/connectors';

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

const defaultConnectors = ({
  chains,
  app,
  walletConnectProjectId,
}: DefaultConnectorsProps) => {
  const hasAllAppData = app.name && app.icon && app.description && app.url;
  const shouldUseSafeConnector =
    !(typeof window === 'undefined') && window?.parent !== window;

  let connectors: CreateConnectorFn<any>[] = [];

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
      headlessMode: true,
      overrideIsMetaMask: false,
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

  connectors.push(
    injected({
      shimDisconnect: true,
    })
  );

  return connectors;
};

export default defaultConnectors;
