import { EmbeddedState } from "@openfort/openfort-js";
import { useAccount } from "wagmi";
import { useOpenfortCore } from '../../openfort/useOpenfort';

export enum OpenfortStatus {
  DISCONNECTED,
  NEEDS_RECOVERY,
  LOADING,
  CONNECTED,
}

/**
 * Hook for monitoring Openfort connection and authentication status
 *
 * This hook provides real-time status information about the user's connection to Openfort
 * services and embedded wallet state. It tracks various states including loading, connected,
 * disconnected, and authentication status based on embedded wallet configuration and connection.
 *
 * @returns Current connection and authentication status flags
 *
 * @example
 * ```tsx
 * const status = useStatus();
 *
 * // Check connection states
 * if (status.isLoading) {
 *   console.log('Initializing Openfort connection...');
 * } else if (status.isConnecting) {
 *   console.log('Connecting to wallet...');
 * } else if (status.isConnected) {
 *   console.log('Successfully connected to Openfort');
 * } else if (status.isDisconnected) {
 *   console.log('Not connected to Openfort');
 * }
 *
 * // Check authentication state
 * if (status.isAuthenticated) {
 *   console.log('User is authenticated');
 *   // Show authenticated UI
 * } else {
 *   console.log('User is not authenticated');
 *   // Show login UI
 * }
 *
 * // Conditional rendering based on status
 * const renderContent = () => {
 *   if (status.isLoading) return <LoadingSpinner />;
 *   if (status.isConnecting) return <ConnectingIndicator />;
 *   if (status.isConnected && status.isAuthenticated) return <AuthenticatedApp />;
 *   return <LoginForm />;
 * };
 * ```
 */
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
