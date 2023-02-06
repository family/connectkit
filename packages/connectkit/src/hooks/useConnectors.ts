import { Connector, useConnect } from 'wagmi';

export function useConnectors() {
  const { connectors } = useConnect();
  return connectors;
}

export { Connector };
