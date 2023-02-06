import { useConnectors } from './useConnectors';

export function useChains() {
  // TODO: Find a better way to get configuration chains, but for now just grab first connector's chains
  const connectors = useConnectors();
  return connectors[0]?.chains;
}
