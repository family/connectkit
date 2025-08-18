export { OPENFORT_VERSION } from './version';

export * from './types';
export { default as getDefaultConfig } from './defaultConfig';
export { default as getDefaultConnectors } from './defaultConnectors';
export { wallets } from './wallets';

export {
  AuthProvider,
} from './components/Openfort/types';
export {
  Openfortcontext,
} from './components/Openfort/context';
export {
  OpenfortProvider,
} from './components/Openfort/OpenfortProvider';
export { OpenfortButton } from './components/ConnectButton';

//export { default as NetworkButton } from './components/NetworkButton';
//export { default as BalanceButton, Balance } from './components/BalanceButton';
export { default as Avatar } from './components/Common/Avatar';
export { default as ChainIcon } from './components/Common/Chain';

// Hooks
export { useChains } from './hooks/useChains';
export { useChainIsSupported } from './hooks/useChainIsSupported';

export { useStatus, OpenfortStatus } from './hooks/openfort/useStatus';
export { useUser } from './hooks/openfort/useUser';

export { useUI } from "./hooks/openfort/useUI";

export { useWallets, UserWallet } from "./hooks/openfort/useWallets";
export { useWallet } from "./hooks/openfort/useWallet";

export { RecoveryMethod, AuthPlayerResponse } from "@openfort/openfort-js";

export { useOpenfortCore as useOpenfort } from './openfort/useOpenfort';
export { useConnectWithSiwe } from './hooks/openfort/useConnectWithSiwe';

export { embeddedWalletId } from './constants/openfort';
export { useEmailAuth } from './hooks/openfort/auth/useEmailAuth';
export { useAuthCallback } from './hooks/openfort/auth/useAuthCallback';
export { useGuestAuth } from './hooks/openfort/auth/useGuestAuth';
export { useWalletAuth } from './hooks/openfort/auth/useWalletAuth';
export { useOAuth } from './hooks/openfort/auth/useOAuth';
export { useSignOut } from './hooks/openfort/auth/useSignOut';
