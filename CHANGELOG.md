# Changelog

All notable changes to this project will be documented in this file.

## [0.0.29] - 2025-10-22

### Feat

- update useWallets to include accounts when returning a wallet

## [0.0.28] - 2025-10-21

### Chore

- change internal configuration

## [0.0.27] - 2025-10-20

### Fix

- Fix wallet connect

## [0.0.26] - 2025-10-17

### Feat

- Fix bug in recover wallet

## [0.0.25] - 2025-10-16

### Feat

- Update Deps

## [0.0.24] - 2025-10-15

### Feat

- SDK events

## [0.0.23] - 2025-10-15

### Fix

- EOA wallet auto recovery

## [0.0.22] - 2025-10-14

### Chore

- Update deps

## [0.0.21] - 2025-10-03

### Feat

- UI: Fix wording in mobile connect modal
- UI: Fix loading text position in loading component

## [0.0.20] - 2025-10-03

### Feat

- UI: When there are more than 4 providers, show remaining + "More" button instead of just "More"

## [0.0.19] - 2025-10-03

### Fix

- Fix get EOA accounts

## [0.0.18] - 2025-10-03

### Fix

- Fix export key

## [0.0.17] - 2025-09-30

### Feat

- Update openfort-js
- Add recoverWalletAutomaticallyAfterAuth to provider
- Fix onsuccess create wallet callback

## [0.0.16] - 2025-09-30

### Fix

- Prevent syntax error in strict regex runtimes

## [0.0.15] - 2025-09-30

### Feat

- Improve mobile dApp experience
- Tooltip color gets text color from variable
- Link email flow improved

## [0.0.14] - 2025-09-29

### Fix

- Fixed email provider if it's not the first one
- Get wallets no longer has limit of 10 wallets

## [0.0.13] - 2025-09-26

### Feat

- Improve email login flow
- Add APPLE Auth provider
- Add type descriptions

## [0.0.12] - 2025-09-25

### Feat

- Add DISCORD auth provider
- Fix logout handling to properly reset modal state and reload customTheme if changes
- Fix connectors on mobile
- Improve error handling

## [0.0.11] - 2025-09-22

### Feat

- Make walletConnectProjectId optional in defaultConfig

## [0.0.10] - 2025-09-15

### Feat

- Openfort wallet return connector

## [0.0.9] - 2025-09-11

### Chore

- Update deps

## [0.0.8] - 2025-09-09

### Improvements

- Add passkeys

## [0.0.7] - 2025-09-08

### Feat

- Add access token on getEncryptionSession

## [0.0.6] - 2025-09-04

### Improvements

- Removed unnecessary shield keys
- Updated password flow
- Policy per chain instead

## [0.0.5] - 2025-08-29

### Improvements

- Update openfort-js
- Third party auth

## [0.0.4] - 2025-08-18

### Improvements

- Internal naming
- Fix active wallet issue

## [0.0.3] - 2025-08-13

### Hooks and update

- Update some auth hooks
- Update openfort-js version

## [0.0.2] - 2025-08-11

### Multi account

- Adding multi account

## [0.0.1] - 2025-08-11

### Hooks

- Add headless hooks
- Configuration and API Updates
- Rename @openfort/openfort-react to @openfort/react

## [0.0.15] - 2025-05-29

### Fix

- save get access token

## [0.0.14] - 2025-05-26

### Feat

- useUser refreshes auth token

## [0.0.13] - 2025-05-26

### Feat

- Update dependencies

## [0.0.12] - 2025-05-14

### Feat

- Update dependencies

## [0.0.11] - 2025-04-24

### Feat

- Update @openfort/openfort-js

## [0.0.10] - 2025-04-22

### Fix

- Fix password input for safari users

## [0.0.9] - 2025-02-31

### Chore

-Update type exports

## [0.0.8] - 2025-02-19

### Update UI

- Updated password ui
- Updated powered by openfort
- Fixed a issue with loading screen

## [0.0.7] - 2025-02-19

### Improvement

- Update package versions
- Show password input option
- Fix circular dependencies

## [0.0.5] - 2025-02-19

### Chore

- Update openfort-js

## [0.0.4] - 2025-02-11

### Separated Hooks

- Separated hooks instead of having a general useOpenfort. This hook is no longer available.
  To learn more about the available hooks go to the [openfort documentation](https://www.openfort.io/docs/guides/react/hooks).

## [0.0.3] - 2025-02-11

### Fix issues

- Added openfort-js as direct dependency, button href issue solved

## [0.0.2] - 2025-02-11

### Exported methods and types

- Exported methods and types have been updated.

## [0.0.1] - 2025-02-11

### Initial release

This release marks the first stable version of the project, featuring built-in authentication, seamless wallet connectivity, and a customizable user interface.
