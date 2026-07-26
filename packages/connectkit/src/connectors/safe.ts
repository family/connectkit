import { safe as wagmiSafe, type SafeParameters } from 'wagmi/connectors/safe';

import { ConnectKitConnector } from './types';

export type { SafeParameters };

/**
 * Safe (multisig) app connector.
 * Requires the `@safe-global/safe-apps-provider` and
 * `@safe-global/safe-apps-sdk` packages to be installed.
 *
 * The connector is only created when running inside an app frame (e.g.
 * Safe{Wallet}); in a regular browsing context it is omitted from the
 * config, matching ConnectKit's historical behavior.
 */
export const safe = (parameters?: SafeParameters): ConnectKitConnector => ({
  _ckConnector: true,
  id: 'safe',
  createConnector: () => {
    const shouldUseSafeConnector =
      !(typeof window === 'undefined') && window?.parent !== window;
    if (!shouldUseSafeConnector) return null;
    return wagmiSafe({
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      ...parameters,
    });
  },
});
