import { useConfig } from 'wagmi';

export function useChainIsSupported(chainId?: number): boolean | null {
  if (!chainId) return false;
  const { chains } = useConfig();
  return chains.some((x) => x.id === chainId);
}
