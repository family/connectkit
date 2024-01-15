import { useContext } from 'react';
import { WagmiContext } from 'wagmi';

export function useChains() {
  const wagmi = useContext(WagmiContext);
  const chains = wagmi?.chains ?? [];
  return chains;
}
