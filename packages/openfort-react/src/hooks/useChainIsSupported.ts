import { useConfig } from 'wagmi';

/**
 * Hook for checking if a blockchain chain is supported
 *
 * This hook verifies whether a specific blockchain chain ID is included in the
 * configured chains. It's useful for validating chain compatibility before
 * attempting operations or displaying chain-specific UI elements.
 *
 * @param chainId - The blockchain chain ID to check for support
 * @returns True if chain is supported, false if not supported, null if chainId is undefined
 *
 * @example
 * ```tsx
 * const isEthereumSupported = useChainIsSupported(1);
 * const isPolygonSupported = useChainIsSupported(137);
 * const isArbitrumSupported = useChainIsSupported(42161);
 * const isUnsupportedChain = useChainIsSupported(999999);
 *
 * // Check support before operations
 * const handleChainOperation = (targetChainId: number) => {
 *   const isSupported = useChainIsSupported(targetChainId);
 *
 *   if (isSupported) {
 *     console.log(`Chain ${targetChainId} is supported`);
 *     // Proceed with chain-specific operations
 *   } else {
 *     console.warn(`Chain ${targetChainId} is not supported`);
 *     // Show error or fallback UI
 *   }
 * };
 *
 * // Example usage in component
 * const ChainStatus = ({ chainId }: { chainId: number }) => {
 *   const isSupported = useChainIsSupported(chainId);
 *
 *   return (
 *     <div>
 *       Chain {chainId}: {isSupported ? '✅ Supported' : '❌ Not Supported'}
 *     </div>
 *   );
 * };
 *
 * // Conditional rendering based on chain support
 * return (
 *   <div>
 *     {isEthereumSupported && <EthereumFeatures />}
 *     {isPolygonSupported && <PolygonFeatures />}
 *     {!isUnsupportedChain && <UnsupportedChainWarning />}
 *   </div>
 * );
 * ```
 */
export function useChainIsSupported(chainId?: number): boolean | null {
  const { chains } = useConfig();
  if (!chainId) return false;
  return chains.some((x) => x.id === chainId);
}
