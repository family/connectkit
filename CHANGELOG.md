# 1.6.0

This update adds [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) support for enhanced wallet discovery and improves the functionality and developer experience of using ConnectKit.

## New

- Support for [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963).
  - Includes dependency [`mipd`](https://www.npmjs.com/package/mipd) for EIP-6963 TypeScript utilities, built by the team at [wevm](https://github.com/wevm) (creators of [wagmi](https://wagmi.sh/) and [viem](https://viem.sh/)).
- Added [Zerion](https://zerion.io) extension support.

## Improved

- Hide SIWE tooltip when using `hideTooltips` option.

# 1.5.3

This update adds branding support for additional detectable injected connectors and improves the functionality and developer experience of using ConnectKit.

## New

- [Rainbow](https://rainbow.me/) extension support.
- Exports `defaultConnectors`

## Improved

- Added name in header for injected wallet when detected by wagmi.

## Fixed

- Fixed UI overflow in switch network tab.
- Fixed text overlap in switch network buttons.
- Provide `exports.types` in `package.json`

# 1.5.2

This update addresses a few bugs and improves the overall experience of ConnectKit.

## Fixed

- Added `wcm-modal` tag to css variable override.
- Fixed flash of unstyled content on the `<ChainIcon>` component.
- Fixed bug where the modal wouldn't open if the configuration didn't include the `InjectedConnector`.

# 1.5.1

This update improves how ConnectKit handles multiple injected wallets.

## Improved

- Better support when dealing with multiple injected wallets.

## Fixed

- Updated `--w3m-z-index` to `--wcm-z-index` to align with latest wagmi connectors.

# 1.5.0

This update improves the developer experience of using ConnectKit by upgrading the peer dependency, [wagmi](https://wagmi.sh), to version `1.1.x`, updating [viem](https://viem.sh/) to version `1.x.x`, and providing additional wallet branding support.

## New

- Updates peer dependency `wagmi` to `1.1.x`.
- Updates peer dependency `viem` to `1.x.x`.
- Add branding for the following injected wallets:
  - [Rabby](https://rabby.io)
  - [TokenPocket](https://tokenpocket.pro)
  - [Family](https://family.co)
  - [Trust](https://trustwallet.com)
  - [Frontier](https://www.frontier.xyz/)
  - [Talisman](https://www.talisman.xyz/)
  - [Infinity](https://infinitywallet.io/)
  - [Phantom](https://phantom.app) (2023 rebrand)

## Improved

- Better support for injected wallets.
- Updated [Phantom](https://phantom.app) branding.

## Misc

- Fixed typo in Safe website URL.
- Updated some SVGs to be more performant with JSX.
- Fixed arrows in buttons not inheriting hover colors.

# 1.4.0

This update improves the developer experience of using ConnectKit by upgrading the peer dependency wagmi up a version to `1.x.x`, and removes the peer dependency `ethers` in favor of [`viem`](https://viem.sh).

> **Note**
>
> This version of ConnectKit has breaking changes. Make sure your application is compatible by following the [migration guide](https://docs.family.co/connectkit/migration-guide#140-breaking-changes).

## New

- Updates peer dependency `wagmi` to `1.x.x`.
- Adds peer dependency [`viem`](https://viem.sh).

## Deprecated

- Removes peer dependency on `ethers`.

# 1.3.0

WalletConnect v1 is scheduled to shut down and will be no longer be supported after **June 28 2023.** It is advised to update your dApps immediately to support WalletConnect v2.

[Read the announcement](https://medium.com/walletconnect/how-to-prepare-for-the-walletconnect-v1-0-shutdown-1a954da1dbff)

> **Note**
>
> This version of ConnectKit has breaking changes. Make sure your application is compatible by following the [migration guide](https://docs.family.co/connectkit/migration-guide#130-breaking-changes).

## New

- Adds support for WalletConnect v2.

### Deprecated

- Removes default support for WalletConnect v1.

# 1.2.4

This update adds branding support for additional detectable injected connectors and improves the functionality and developer experience of using ConnectKit with Sign In With Ethereum.

## New

- Branding for additional injected connectors:
  - Frame
  - Phantom
  - Dawn
- `connectkit-next-siwe` version `0.1.1` add adds `afterNonce` `afterVerify` `afterSession` and `afterLogout` callbacks to the server-side SIWE helper functions.
- `connectkit-next-siwe` version `0.2.0` updates peer dependency `siwe` to `2.0.0`.

# 1.2.3

This update adds some minor quality of life features to ConnectKit.

## Improved

- Updated styling of the switch chain page for better readability.
- Adds prefix to LocalStorage keys to avoid collisions with other apps.
- Restyled [documentation site](https://docs.family.co/connectkit) to make following guides even easier.

# 1.2.2

This update improves the functionality and developer experience of using ConnectKit and moves the peer dependency wagmi up a version to `0.12.x`.

> **Note**
>
> This update does not yet include support for WalletConnect 2.0.

## New

- Adds a `Recent` badge to the most recently used connector button by a user. This helps returning users reconnect easily and save time.
- Introduce [`SafeConnector`](https://wagmi.sh/react/connectors/safe) into the default configuration for better support for Safe Apps. Learn more about this connector in the [wagmi](https://wagmi.sh/react/connectors/safe) docs.
- Convenient `onConnect` and `onDisconnect` callbacks on the `ConnectKitProvider` component and `useModal` Hook.
- Added dedicated `overlayBlur` prop to `ConnectKitProvider` to allow for blurring the background when the modal is open.
- Update peer dependency wagmi to version `0.12.x`.

## Improved

- Added support for Node 14.
- Improved aria-labels on buttons for better accessibility.
- Icons within buttons are now properly horizontally centered on FireFox.
- Optimise some of the SVGs used in ConnectKit.

## Fixed

- Fixed a bug where changing accounts when signed-in with Ethereum would cause an infinite loop (thanks [JamieLottering](https://github.com/JamieLottering)).

# 1.2.1

This update improves the functionality and developer experience of using ConnectKit and moves the peer dependency wagmi up a version to `0.11.x`.
This update does not yet include support for WalletConnect 2.0 (wagmi `0.12.x`)

> **Note**
>
> This version of wagmi has breaking changes. Make sure your application is compatible by following [wagmi's migration guide](https://wagmi.sh/react/migration-guide#011x-breaking-changes).

## New

- Update peer dependency wagmi to version `0.11.x` (thanks [Songkeys](https://github.com/Songkeys)).
- Add new `pt-BR` translations (thanks [LuwkasLima](https://github.com/luwkaslima)).
- Include new `hideBalance` option to hide the wallet balance from the profile view.
- Include new `enforceSupportedChains` option to disable the forced network switching UX when connected to an unsupported chain.
- Include new `disableSiweRedirect` option to disable the redirect to the SIWE page when a wallet connects.
- Include new functions from the `useModal` Hook to choose a page to navigate to on open.
  - The `openSIWE()` function accepts a boolean, if `true` it will initiate the wallet SIWE signing request at the same time as opening the modal.
- Add logos for the following chains:
  - Optimism Goerli
  - Telos + Testnet
  - Aurora + Testnet
  - Avalanche + Fuji Testnet
  - Foundry
  - Gnosis
  - Evmos + Testnet
  - BNB Smart Chain + Testnet
  - Sepolia
  - Taraxa + Testnet
  - zkSync + Testnet
  - Celo + Alfajores Testnet
  - Canto
  - Fantom + Testnet
  - Filecoin + Hyperspace + Calibration Testnets
  - Flare + Coston2 testnet
  - Metis + Testnet
  - IoTeX + Testnet

## Improved

- Update testbench for better developer experience.
- Improve logic for `isConnecting` within the Custom `ConnectKitButton`.
- Replace `getGlobalChains` with `useChains` Hook
- Tidy up some internal component structure and include a few useful dev updates (thanks [pugson](https://github.com/pugson)).
- Export `useIsMounted` and `Context` (thanks [shahruz](https://github.com/shahruz)).

# 1.2.0

This update improves the functionality and developer experience of using ConnectKit with Sign In With Ethereum.

## New

- Add `onSignIn` and `onSignOut` handlers for `useSIWE` and the SIWE provider.

## Improved

- Separate the SIWE helper functions into more friendlier client and server configurations.
- Improved the `useSIWE` hook to allow for better dev access to SIWE functionality.

# 1.1.4

This update adds some minor quality of life features to ConnectKit.

## Improved

- Included `shimChainChangedDisconnect` option to `MetaMaskConnector` to automatically disconnect the wallet when the chain changes in particular version of MetaMask (thanks [Songkeys](https://github.com/Songkeys)).
- Added `size` prop to `ChainIcon` component to allow for custom sizing (thanks [JamieLottering](https://github.com/JamieLottering)).
- Exported type `ConnectKitOptions` for better TypeScript support when creating a wagmi client (thanks [ryanberckmans](https://github.com/ryanberckmans)).
- Included `chain` to `ConnectKitButton.custom` to allow for chains to be passed to custom buttons.

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

> **Note**
>
> This version of wagmi has breaking changes. Make sure your application is compatible by following [wagmi's migration guide](https://wagmi.sh/react/migration-guide#09x-breaking-changes).

# 1.1.0

This update moves the peer dependency wagmi up to the latest version (`0.8.x`).

> **Note**
>
> This version of ConnectKit has breaking changes. Make sure your application is compatible by following the [migration guide](https://docs.family.co/connectkit/migration-guide#110-breaking-changes).

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
