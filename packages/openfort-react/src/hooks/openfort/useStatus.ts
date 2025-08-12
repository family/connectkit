import { useAccount } from "wagmi";
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { EmbeddedState } from "@openfort/openfort-js";

export enum OpenfortKitStatus {
  DISCONNECTED,
  NEEDS_RECOVERY,
  LOADING,
  CONNECTED,
  // CONNECTED_WITHOUT_USER,
}

export function useStatus() {
  const { user, embeddedState } = useOpenfortCore();
  const { isConnected, isConnecting } = useAccount();


  const getStatus = () => {
    if (embeddedState === EmbeddedState.READY) return OpenfortKitStatus.CONNECTED;
    if (embeddedState === EmbeddedState.NONE) return OpenfortKitStatus.LOADING;

    // if (needsRecovery) return OpenfortKitStatus.NEEDS_RECOVERY;
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      if (isConnected) return OpenfortKitStatus.CONNECTED;
      else return OpenfortKitStatus.NEEDS_RECOVERY;
    }

    return OpenfortKitStatus.DISCONNECTED;
  }
  const status = getStatus();

  return {
    isLoading: status === OpenfortKitStatus.LOADING,
    isConnected: status === OpenfortKitStatus.CONNECTED,
    isDisconnected: status === OpenfortKitStatus.DISCONNECTED,
    isConnecting: isConnecting || embeddedState === EmbeddedState.CREATING_ACCOUNT,
    isAuthenticated: !!user,
  }
}
