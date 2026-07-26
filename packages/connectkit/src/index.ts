export const CONNECTKIT_VERSION = '2.0.0';

export * as Types from './types';
export { default as getDefaultConfig } from './defaultConfig';
export { default as getDefaultConnectors } from './defaultConnectors';
export { wallets } from './wallets';

// Connectors with no additional dependencies are exported from the main entry
// for convenience. Connectors whose SDKs are optional peer dependencies
// (coinbaseWallet, walletConnect, safe) must be imported from their own entry
// points (`connectkit/connectors/<name>`) so that only apps using them need
// their SDKs installed.
export { injected } from './connectors/injected';
export { metaMask } from './connectors/metaMask';
export { aaveAccount } from './connectors/aaveAccount';
export type {
  ConnectKitConnector,
  ConnectKitConnectorContext,
} from './connectors/types';

export { useModal } from './hooks/useModal';
export {
  SIWEProvider,
  useSIWE,
  SIWE_NONCE_QUERY_KEY,
  SIWE_SESSION_QUERY_KEY,
} from './siwe';
export type { SIWESession, SIWEConfig } from './siwe';

export { ConnectKitProvider, Context } from './components/ConnectKit';
export { ConnectKitButton } from './components/ConnectButton';
export { default as SIWEButton } from './components/Standard/SIWE';

//export { default as NetworkButton } from './components/NetworkButton';
//export { default as BalanceButton, Balance } from './components/BalanceButton';
export { default as Avatar } from './components/Common/Avatar';
export { default as ChainIcon } from './components/Common/Chain';

// Hooks
export { default as useIsMounted } from './hooks/useIsMounted'; // Useful for apps that use SSR
export { useChains } from './hooks/useChains';
export { useChainIsSupported } from './hooks/useChainIsSupported';

// TODO: Make this private
export { default as ConnectKitModalDemo } from './components/ConnectModal/demo';
