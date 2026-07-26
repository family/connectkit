import { injected as wagmiInjected } from 'wagmi/connectors/injected';

import { ConnectKitConnector } from './types';

/**
 * MetaMask via the injected provider (`injected({ target: 'metaMask' })`),
 * matching ConnectKit's historical behavior. No additional dependencies
 * required — this does not use the MetaMask SDK connector.
 */
export const metaMask = (): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'metaMask',
  createConnector: () => wagmiInjected({ target: 'metaMask' }),
});
