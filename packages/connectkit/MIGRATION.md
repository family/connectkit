# Migrating to ConnectKit 2.0

ConnectKit 2.0 upgrades to **wagmi v3** and adopts its connector model:
connector SDKs are optional peer dependencies, and connectors are added
individually — your app only installs and bundles what it uses.

## 1. Update dependencies

```sh
npm install connectkit@2 wagmi@3 viem@2 @tanstack/react-query
```

Requirements: React ≥18, TypeScript ≥5.9.3 (if using TypeScript).

## 2. Add your connectors explicitly

In 1.x, `getDefaultConfig` silently included MetaMask, Coinbase Wallet,
WalletConnect (when `walletConnectProjectId` was set) and Safe (inside app
frames). In 2.0 the default set only contains connectors that need no extra
dependencies: **Aave Account** and **MetaMask (injected)**.

Everything else is opt-in — install the SDK and add the connector:

| Connector | Import from | Install |
| --- | --- | --- |
| `injected` | `connectkit` | — |
| `metaMask` | `connectkit` | — |
| `aaveAccount` | `connectkit` | — |
| `coinbaseWallet` | `connectkit/connectors/coinbaseWallet` | `@coinbase/wallet-sdk` |
| `walletConnect` | `connectkit/connectors/walletConnect` | `@walletconnect/ethereum-provider` |
| `safe` | `connectkit/connectors/safe` | `@safe-global/safe-apps-provider` + `@safe-global/safe-apps-sdk` |

To reproduce the full 1.x default set:

```sh
npm install @coinbase/wallet-sdk @walletconnect/ethereum-provider \
  @safe-global/safe-apps-provider @safe-global/safe-apps-sdk
```

```ts
import { getDefaultConfig, aaveAccount, metaMask } from 'connectkit';
import { coinbaseWallet } from 'connectkit/connectors/coinbaseWallet';
import { walletConnect } from 'connectkit/connectors/walletConnect';
import { safe } from 'connectkit/connectors/safe';
import { createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    appName: 'My App',
    walletConnectProjectId: '...',
    connectors: [
      aaveAccount(),
      safe(), // only created inside app frames (e.g. Safe{Wallet})
      metaMask(),
      coinbaseWallet(),
      walletConnect(),
    ],
  })
);
```

Connector factories inherit app-level options from `getDefaultConfig`
(`appName`/`appIcon` → Coinbase & WalletConnect metadata,
`walletConnectProjectId`, `coinbaseWalletPreference`, `aaveAccountOptions`);
options passed to a factory directly take precedence. Plain wagmi
`CreateConnectorFn` values can be mixed into the same `connectors` array.

## 3. Behavior changes to review

- `coinbaseWalletPreference` now only accepts the object form
  (`{ options: 'smartWalletOnly' }`) — the string shorthand was removed by
  wagmi/the Coinbase SDK.
- `useBalance` (wagmi) no longer returns `formatted`; use viem's
  `formatUnits(value, decimals)`.
- If `walletConnect()` is added without a project id it is omitted with a
  console warning (matching 1.x, which skipped it silently).
- wagmi v2 hook names (`useAccount` etc.) still work in wagmi v3 but are
  deprecated aliases of the new `useConnection` family — plan to rename.
