import { useConnectors } from './../useConnectors';

export const useWalletConnectConnector = () => {
  const connectors = useConnectors();

  const connector = connectors.find((c) => c.id === 'walletConnect');
  if (!connector) return null;

  // Opinionated decisions
  connector.options.qrCode = false; // avoid default modal

  return connector;
};
