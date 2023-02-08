import { useEffect, useState } from 'react';
import { Connector, useConnectors } from './../useConnectors';

// CoinbaseWalletConnector requires using the connector directly from wagmi's useConnect Hook (useConnectors) or else it won't connect properly.
export const useCoinbaseWalletConnector = () => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);
  const connectors = useConnectors();

  useEffect(() => {
    const coinbaseWallet = connectors.find((c) => c.id === 'coinbaseWallet');
    if (coinbaseWallet) setConnector(coinbaseWallet);
  }, [connectors]);

  return {
    connector,
  };
};
