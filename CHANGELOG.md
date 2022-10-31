# 0.0.3

This update introduces Sign In with Ethereum and other helpful changes and additions to make your app better than ever.

## New

- Added **Sign In with Ethereum** support with a Next.js package to help with quick setup.
- Added an `<Avatar />` component for developers to utilize the default ConnectKit avatar.
- Created a `<CustomAvatar />` component for developers to override the default avatar.
- Added a `walletConnectCTA` option under `options` to choose whether to display the 'Copy to Clipboard' option under the WalletConnect QR code.
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
