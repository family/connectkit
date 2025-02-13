import { useAccount } from "wagmi";
import { useOpenfort } from "../../openfort/OpenfortProvider";

export enum OpenfortKitStatus {
  LOADING,
  CONNECTED,
  DISCONNECTED,
  NEEDS_RECOVERY,
  DISCONNECTED_WITH_ADDRESS,
}

export function useStatus() {
  const { isLoading, needsRecovery, user } = useOpenfort();
  const { isConnected } = useAccount();

  const getStatus = () => {
    if (isLoading) return OpenfortKitStatus.LOADING;
    if (needsRecovery) return OpenfortKitStatus.NEEDS_RECOVERY;
    if (!user) {
      if (isConnected) return OpenfortKitStatus.DISCONNECTED_WITH_ADDRESS;
      return OpenfortKitStatus.DISCONNECTED;
    }

    return OpenfortKitStatus.CONNECTED;
  }
  const status = getStatus();

  return {
    status,
    isLoading: status === OpenfortKitStatus.LOADING,
    isConnected: status === OpenfortKitStatus.CONNECTED,
    isDisconnected: status === OpenfortKitStatus.DISCONNECTED,
    isDisconnectedWithAddress: status === OpenfortKitStatus.DISCONNECTED_WITH_ADDRESS,
    needsRecovery: status === OpenfortKitStatus.NEEDS_RECOVERY,
  }
}
