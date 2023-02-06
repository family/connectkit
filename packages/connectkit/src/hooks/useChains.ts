import { useConnect } from 'wagmi';

export function useChains() {
  // TODO: Find a better way to get configuration chains, but for now just grab first connector's chains
  const { connectors } = useConnect();
  return connectors[0]?.chains;
}
