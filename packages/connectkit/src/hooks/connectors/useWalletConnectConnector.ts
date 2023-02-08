import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Connector, useConnectors } from './../useConnectors';

export const useWalletConnectConnector = ({
  qrcode = false, // avoids default modal
}: {
  qrcode?: boolean;
}) => {
  const [connector, setConnector] = useState<Connector | undefined>(undefined);
  const connectors = useConnectors();
  const { isConnected } = useAccount();

  useEffect(() => {
    const walletConnect = connectors.find((c) => c.id === 'walletConnect');
    if (walletConnect) setConnector(walletConnect);
  }, [connectors, isConnected]);

  return {
    connector,
  };
};
