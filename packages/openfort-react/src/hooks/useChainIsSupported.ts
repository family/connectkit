import { useConfig } from 'wagmi';

/**
 * Hook for checking if a blockchain chain is supported.
 *
 * This hook verifies whether a specific blockchain chain ID is part of the
 * configured Wagmi chains. Use it to validate chain compatibility before
 * attempting operations or rendering chain-specific UI.
 *
 * @param chainId - The blockchain chain ID to check for support.
 * @returns `true` when the chain is configured, `false` otherwise.
 *
 * @example
 * ```tsx
 * const ChainStatus: React.FC<{ chainId?: number }> = ({ chainId }) => {
 *   const isSupported = useChainIsSupported(chainId);
 *
 *   return (
 *     <span>
 *       {chainId ?? 'Unknown chain'}: {isSupported ? 'Supported' : 'Unsupported'}
 *     </span>
 *   );
 * };
 * ```
 */
export function useChainIsSupported(chainId?: number): boolean {
  const { chains } = useConfig();
  if (chainId === undefined || chainId === null) return false;
  return chains.some((x) => x.id === chainId);
}
