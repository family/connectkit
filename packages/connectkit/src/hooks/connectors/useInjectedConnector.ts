import { useEffect, useState } from 'react';
import { Connector, useConnectors } from './../useConnectors';

import { InjectedConnector } from 'wagmi/connectors/injected';

export const useInjectedConnector = () => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);
  const connectors = useConnectors();

  useEffect(() => {
    const injected = connectors.find((c) => c.id === 'injected');
    if (injected) {
      const config = {
        ...injected,
        options: {
          ...injected.options,
          shimDisconnect: true,
          name: (
            detectedName: string | string[] // Detects the name of the injected wallet
          ) =>
            `Injected (${
              typeof detectedName === 'string'
                ? detectedName
                : detectedName.join(', ')
            })`,
        },
      };
      setConnector(new InjectedConnector(config));
    }
  }, [connectors]);

  return {
    connector,
  };
};
