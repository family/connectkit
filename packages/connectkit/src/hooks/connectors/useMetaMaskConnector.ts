import { useEffect, useState } from 'react';
import { Connector, useConnectors } from './../useConnectors';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

export const useMetaMaskConnector = () => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);

  const connectors = useConnectors();
  const metaMask = connectors.find((c) => c.id === 'metaMask');

  useEffect(() => {
    if (metaMask) {
      const config = {
        ...metaMask,
        options: {
          ...metaMask.options,
          shimDisconnect: true,
          shimChainChangedDisconnect: false,
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      };
      setConnector(new MetaMaskConnector(config));
    }
  }, []);

  return {
    connector,
  };
};
