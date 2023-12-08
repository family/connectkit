import { ReactNode } from 'react';
import { createMipd } from './mipd';
import { useConnectors } from '../hooks/useConnectors';
import { Connector } from 'wagmi';

interface ConnectorInfo {
  id: string;
  name?: string;
  icon?: ReactNode;
  connector?: Connector;
}

const mipd = createMipd();

export const getConnectorInfo = (
  id: string,
  injectedUUID?: string
): ConnectorInfo | null => {
  const connectors = useConnectors();

  // If the connector is injected, we need to find the connector info, which can be either EIP-6963 (MIPD) or EIP-1193
  if (id === 'injected' && injectedUUID) {
    const mipdConnector = mipd?.findConnectorByUUID(injectedUUID);
    if (mipdConnector) {
      return {
        id: mipdConnector.uuid,
        name: mipdConnector.name,
        icon: <img src={mipdConnector.icon} alt={mipdConnector.name} />,
        connector: connectors.find((c) => c.id === injectedUUID),
      };
    }
  }

  return null;
};
