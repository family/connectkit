import { EmbeddedState } from "@openfort/openfort-js";
import { useAccount } from "wagmi";
import { useOpenfortCore } from '../../openfort/useOpenfort';

export enum OpenfortStatus {
  DISCONNECTED,
  NEEDS_RECOVERY,
  LOADING,
  CONNECTED,
}

export function useStatus() {
  const { embeddedState } = useOpenfortCore();
  const { isConnected, isConnecting } = useAccount();

  const getStatus = () => {
    if (embeddedState === EmbeddedState.READY) return OpenfortStatus.CONNECTED;
    if (embeddedState === EmbeddedState.NONE) return OpenfortStatus.LOADING;

    // if (needsRecovery) return OpenfortStatus.NEEDS_RECOVERY;
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      if (isConnected) return OpenfortStatus.CONNECTED;
      else return OpenfortStatus.NEEDS_RECOVERY;
    }

    return OpenfortStatus.DISCONNECTED;
  }
  const status = getStatus();

  return {
    isLoading: status === OpenfortStatus.LOADING,
    isConnected: status === OpenfortStatus.CONNECTED,
    isDisconnected: status === OpenfortStatus.DISCONNECTED,
    isConnecting: isConnecting || embeddedState === EmbeddedState.CREATING_ACCOUNT,
    isAuthenticated: embeddedState !== EmbeddedState.NONE && embeddedState !== EmbeddedState.UNAUTHENTICATED,
  }
}
