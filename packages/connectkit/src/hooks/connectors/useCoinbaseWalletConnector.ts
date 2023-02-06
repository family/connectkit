import { useConnectors } from './../useConnectors';

export const useCoinbaseWalletConnector = () => {
  const connectors = useConnectors();

  const connector = connectors.find((c) => c.id === 'coinbaseWallet');
  if (!connector) return null;

  // Opinionated decisions
  connector.options.headlessMode = true; // avoid default modal

  return connector;
};
