import { useConnectors } from './../useConnectors';

export const useInjectedConnector = () => {
  const connectors = useConnectors();

  const connector = connectors.find((c) => c.id === 'injected');
  if (!connector) return null;

  // Opinionated decisions
  connector.options.shimDisconnect = true;
  connector.options.name = (
    detectedName: string | string[] // Detects the name of the injected wallet
  ) =>
    `Injected (${
      typeof detectedName === 'string' ? detectedName : detectedName.join(', ')
    })`;

  return connector;
};
