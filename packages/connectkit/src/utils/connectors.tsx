import { ReactNode } from 'react';
import { createMidp } from './midp';
import { useConnectors } from '../hooks/useConnectors';
import { Connector } from 'wagmi';

interface ConnectorInfo {
  id: string;
  name?: string;
  icon?: ReactNode;
  connector?: Connector;
}

const midp = createMidp();

export const getConnectorInfo = (
  id: string,
  injectedUUID?: string
): ConnectorInfo | null => {
  const connectors = useConnectors();

  // If the connector is injected, we need to find the connector info, which can be either EIP-6963 (MIDP) or EIP-1193
  if (id === 'injected' && injectedUUID) {
    const midpConnector = midp?.findConnectorByUUID(injectedUUID);
    if (midpConnector) {
      return {
        id: midpConnector.uuid,
        name: midpConnector.name,
        icon: <img src={midpConnector.icon} alt={midpConnector.name} />,
        connector: connectors.find((c) => c.id === injectedUUID),
      };
    }
  }

  return null;
};
