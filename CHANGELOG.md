# 1.2.0

This update moves the peer dependency [wagmi](https://wagmi.sh) up to the latest version (`>=0.11.5) to support WalletConnect v2.

{% note %}
This version of ConnectKit has breaking changes. Make sure your application is compatible by following the [migration guide (TODO: Get link to migration guide)](https://docs.family.co/connectkit/migration-guides).
{% endnote %}

## Improved

- WalletConnect v2 support.
- Refactored wallet connectors to be more extensible.
- Replaced `getGlobalChains` with `useChains` hook that syncs better with configured connectors.
- Added `useConnectors` hook to access the above connectors if necessary.
- Export `useIsMounted` for developers to not have to provide their own solution.
-

# 1.1.3

This update fixes compatibility issues that were found with Next 13's default configuration. If you would like to use previous versions of ConnectKit you will need to make sure your application [supports Terser compression](https://nextjs.org/docs/advanced-features/compiler#minification).

## Removed

- Terser build compression.

## Improved

- Synced dev and prod rollup configs to avoid environment mismatching.
- Next.js 13 config no longer requires Terser support ([`swcMinify: false`](https://nextjs.org/docs/advanced-features/compiler#minification)).

# 1.1.2

This update moves the peer dependency wagmi up to the latest version (`0.10.x`).
This does not yet include support for WalletConnect 2.0.

## New

- Update peer dependency wagmi to version `0.10.x`.
- New options for `ethereumOnboardingUrl` and `walletOnboardingUrl` to custom change the _Learn More_ and _About Wallets_ call to actions.

## Fixed

- Remove sunset ethhub.io links and replace with ethereum.org links.

## Improved

- Update to chain handling to allow devs access to the configured chains using `getGlobalChains`.
- Update to allow turning off the default targeted `chainId` to let wallets connect using their currently active chain.
- - This can be done by setting `initialChainId` to `0` within the `getDefaultClient` helper function.

# 1.1.1

This update moves the peer dependency [wagmi](https://wagmi.sh) up to the latest version (`0.9.x`).

{% note %}
This version of wagmi has breaking changes. Make sure your application is compatible by following [wagmi's migration guide](https://wagmi.sh/react/migration-guide#09x-breaking-changes).
{% endnote %}

# 1.1.0

This update moves the peer dependency wagmi up to the latest version (`0.8.x`).

{% note %}
This version of ConnectKit has breaking changes. Make sure your application is compatible by following the [migration guide](https://docs.family.co/connectkit/migration-guide#110-breaking-changes).
{% endnote %}

## New

- Update peer dependency wagmi to version `0.8.x`.

## Removed

- Removed CommonJS support to work within wagmi's `0.8.x` requirements.

# 1.0.1

This update introduces localisations to ConnectKit.

## New

- Added a `language` option under `options` that allows developers to include localisation support—starting with options for `Spanish`, `French`, `Japanese` and `Chinese (Simplified)`.

## Fixed

- Removed layered background on the injected connectors flow to allow for transparent modal background colors ([issue #41](https://github.com/family/connectkit/issues/41)).

# 1.0.0

This update introduces Sign In With Ethereum and other helpful changes and additions to make your app better than ever.

## New

- Added **Sign In With Ethereum** support with a Next.js package to help with quick setup.
- Added an `<Avatar />` component for developers to utilize the default ConnectKit avatar.
- Created a `<CustomAvatar />` component for developers to override the default avatar.
- Added a `walletConnectCTA` option under `options` to choose whether to display the 'Copy to Clipboard' option under the WalletConnect QR code.
- Added a `initialChainId` option under `options` to customize the initially connected chain.
- Added a `--ck-overlay-backdrop-filter` property for custom themes to utilise the `backdrop-filter` property on the modal overlay.
- Added a new `nouns` theme to the built-in default themes ⌐◨-◨

## Fixed

- Corrected some variable names for the secondary buttons.

## Improved

- Updated Gnosis Safe to reflect their recent rebrand to 'Safe'.
- Wrong Network UX now suggests a network change and no longer blocks users from changing networks.
- Enabled TypeScript strict mode (bumped target to `es6`).
- Line break for "Scan with Coinbase Wallet" title if the font is too wide.
- Fix an SVG `stop-color` vs `stopColor` issue (thanks [@keon](https://github.com/family/connectkit/pull/25)).
- Added icon support for Arbitrum Goerli (thanks [@mirshko](https://github.com/family/connectkit/pull/26)).
- Unknown chain icon fallback (thanks [@Bridgerz](https://github.com/family/connectkit/pull/29)).

## Removed

- Unnecessary SVGs and logos.

# 0.0.2

## New

- `NetworkButton` component for making network switching easier, opens as a dropdown
- `BalanceButton` component for displaying the balance of the connected wallet (in a button), opens the profile modal
- `Balance` component for displaying the balance of the connected wallet, intentionally left mostly unstyled
- `Avatar` component for displaying a wallets ens avatar, with a fallback to a nice gradient based on that ens/address as a seed

## General

- Add `buffer` as a dependency to ConnectKit. Developers no longer need to maintain their own installation of the `buffer` package.
- Remove Slope as a suggested wallet in the UI
- Default connector buttons in the modal are now filled instead of previously stroked
- Improvements and update to the default themes
- Wallet Connection now requests the first `chain` in the chains array given when creating your client configuration

## ConnectKitButton

- Add props to `<ConnectKitButton />` for additional button configuration
  - `label` to customize the connect button text/label
  - `showBalance` to show wallet balance when connected (false default)
  - `showAvatar` to show ENS/wallet avatar when connected (true default)

## ConnectKitProvider

- Add `disclaimer` option under `options` that accepts a string or ReactNode to be displayed in the first screen of the modal when a wallet is not connected

## Bug Fixes

- Single chain tooltip was not inherting theme correctly

## Misc.

- Visual debug message in the UI when there is a custom client config setup for `CoinbaseWalletConnector` that does not have `headlessMode:true`
