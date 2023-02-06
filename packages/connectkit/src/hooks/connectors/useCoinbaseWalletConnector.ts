import { useEffect, useState } from 'react';
import { Connector, useConnectors } from './../useConnectors';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

export const useCoinbaseWalletConnector = () => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);

  const connectors = useConnectors();
  const coinbaseWallet = connectors.find((c) => c.id === 'coinbaseWallet');

  useEffect(() => {
    if (coinbaseWallet) {
      const config = {
        ...coinbaseWallet,
        options: {
          ...coinbaseWallet.options,
          headlessMode: true, // avoid default modal
        },
      };
      setConnector(new CoinbaseWalletConnector(config));
    }
  }, []);

  return {
    connector,
  };
};
