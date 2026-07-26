import {
  EthereumProviderOptions as AaveAccountOptions,
  aaveAccountConnector,
} from '@aave/account';

import { ConnectKitConnector } from './types';

export type { AaveAccountOptions };

/**
 * Aave Account connector. No additional dependencies required
 * (`@aave/account` ships with ConnectKit).
 */
export const aaveAccount = (
  options?: AaveAccountOptions
): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'aaveAccount',
  createConnector: (ctx) =>
    aaveAccountConnector(options ?? ctx.aaveAccountOptions),
});
