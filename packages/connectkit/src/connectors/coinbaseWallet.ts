import {
  coinbaseWallet as wagmiCoinbaseWallet,
  type CoinbaseWalletParameters,
} from 'wagmi/connectors/coinbaseWallet';

import { ConnectKitConnector } from './types';

export type { CoinbaseWalletParameters };

/**
 * Coinbase Wallet connector.
 * Requires the `@coinbase/wallet-sdk` package to be installed.
 *
 * App name and logo default to the values passed to getDefaultConfig
 * (`appName` / `appIcon`); options passed here take precedence.
 */
export const coinbaseWallet = (
  parameters?: CoinbaseWalletParameters
): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'coinbaseWallet',
  createConnector: (ctx) =>
    wagmiCoinbaseWallet({
      appName: ctx.app.name,
      appLogoUrl: ctx.app.icon,
      preference: ctx.coinbaseWalletPreference,
      ...parameters,
    }),
});
