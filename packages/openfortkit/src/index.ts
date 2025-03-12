export const OPENFORTKIT_VERSION = '0.0.6';

export * as Types from './types';
export { default as getDefaultConfig } from './defaultConfig';
export { default as getDefaultConnectors } from './defaultConnectors';
export { wallets } from './wallets';

export { useModal } from './hooks/useModal';

export {
  OpenfortKitProvider,
  Context as OpenfortKitContext,
  AuthProvider,
} from './components/OpenfortKit';
export { OpenfortKitButton } from './components/ConnectButton';

//export { default as NetworkButton } from './components/NetworkButton';
//export { default as BalanceButton, Balance } from './components/BalanceButton';
export { default as Avatar } from './components/Common/Avatar';
export { default as ChainIcon } from './components/Common/Chain';

// Hooks
export { default as useIsMounted } from './hooks/useIsMounted'; // Useful for apps that use SSR
export { useChains } from './hooks/useChains';
export { useChainIsSupported } from './hooks/useChainIsSupported';

export { useStatus, OpenfortKitStatus } from './hooks/openfort/useStatus';
export { useLogout } from './hooks/openfort/useLogout';
export { useUser } from './hooks/openfort/useUser';

export { useProviders } from "./hooks/openfort/useProviders";
export { useWallets, UserWallet } from "./hooks/openfort/useWallet";

export { RecoveryMethod, AuthPlayerResponse } from "@openfort/openfort-js";
