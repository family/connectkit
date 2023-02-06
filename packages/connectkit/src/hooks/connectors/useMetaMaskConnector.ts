import { useConnectors } from './../useConnectors';

export const useMetaMaskConnector = () => {
  const connectors = useConnectors();

  const connector = connectors.find((c) => c.id === 'metaMask');
  if (!connector) return null;

  // Opinionated decisions
  connector.options.shimDisconnect = true;
  connector.options.shimChainChangedDisconnect = false;
  connector.options.UNSTABLE_shimOnConnectSelectAccount = true;

  return connector;
};
