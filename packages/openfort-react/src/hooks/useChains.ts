import { Chain } from 'viem'
import { useConfig } from 'wagmi'

/**
 * Hook for accessing configured blockchain chains
 *
 * This hook provides access to all blockchain chains configured in the Wagmi config.
 * It returns an array of chain objects containing network information such as
 * chain ID, name, RPC URLs, and other blockchain-specific configuration.
 *
 * @returns Array of configured blockchain chains
 *
 * @example
 * ```tsx
 * const chains = useChains();
 *
 * // Display available chains
 * console.log('Available chains:', chains.map(chain => ({
 *   id: chain.id,
 *   name: chain.name,
 *   nativeCurrency: chain.nativeCurrency,
 * })));
 *
 * // Check if specific chains are available
 * const hasEthereum = chains.some(chain => chain.id === 1);
 * const hasPolygon = chains.some(chain => chain.id === 137);
 *
 * // Example usage in component
 * return (
 *   <div>
 *     <h3>Available Networks:</h3>
 *     <ul>
 *       {chains.map(chain => (
 *         <li key={chain.id}>
 *           {chain.name} (ID: {chain.id})
 *         </li>
 *       ))}
 *     </ul>
 *   </div>
 * );
 * ```
 */
export function useChains() {
  const wagmi = useConfig()
  const chains = wagmi?.chains ?? []
  return chains.map((c) => c) as Chain[]
}
