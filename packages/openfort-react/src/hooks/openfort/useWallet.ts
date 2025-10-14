import { useWallets } from "./useWallets";

/**
 * Hook for accessing the currently active wallet
 *
 * This hook provides access to the user's currently active/connected wallet.
 * It's a simplified interface that returns just the active wallet from the
 * useWallets hook, making it convenient when you only need the current wallet
 * without all the wallet management functionality.
 *
 * @returns Currently active wallet or undefined if no wallet is connected
 *
 * @example
 * ```tsx
 * const activeWallet = useWallet();
 *
 * // Check if user has an active wallet
 * if (activeWallet) {
 *   console.log('Active wallet:', {
 *     address: activeWallet.address,
 *     type: activeWallet.connectorType,
 *     id: activeWallet.id,
 *   });
 * } else {
 *   console.log('No active wallet');
 * }
 *
 * // Access wallet properties
 * const walletAddress = activeWallet?.address;
 * const walletType = activeWallet?.connectorType;
 * const isEmbedded = activeWallet?.connectorType === 'embedded';
 *
 * // Example usage in component
 * return (
 *   <div>
 *     {activeWallet ? (
 *       <div>
 *         <h3>Connected Wallet</h3>
 *         <p>Address: {activeWallet.address}</p>
 *         <p>Type: {activeWallet.connectorType}</p>
 *         {activeWallet.isConnecting && <span>Connecting...</span>}
 *       </div>
 *     ) : (
 *       <div>
 *         <p>No wallet connected</p>
 *         <button>Connect Wallet</button>
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useWallet() {
  const { activeWallet } = useWallets();

  return activeWallet;
}
