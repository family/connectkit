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
