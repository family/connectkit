import { useEffect, useState } from 'react';
import { Connector, useConnectors } from './../useConnectors';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

export const useWalletConnectConnector = ({
  qrcode = false, // avoids default modal
}: {
  qrcode?: boolean;
}) => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);

  const connectors = useConnectors();
  const walletConnect = connectors.find((c) => c.id === 'walletConnect');

  useEffect(() => {
    if (walletConnect) {
      const config = {
        ...walletConnect,
        options: {
          ...walletConnect.options,
          qrcode,
        },
      };
      setConnector(new WalletConnectConnector(config));
    }
  }, []);

  return {
    connector,
  };
};
