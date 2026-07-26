import {
  injected as wagmiInjected,
  type InjectedParameters,
} from 'wagmi/connectors/injected';

import { ConnectKitConnector } from './types';

export type { InjectedParameters };

/**
 * Generic injected (EIP-1193 / EIP-6963) browser wallet connector.
 * No additional dependencies required.
 */
export const injected = (
  parameters?: InjectedParameters
): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'injected',
  createConnector: () => wagmiInjected(parameters),
});
