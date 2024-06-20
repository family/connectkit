import { useState, useEffect } from 'react';

import { Connector, useAccount } from 'wagmi';
import { useConnect } from './../useConnect';
import { useContext } from '../../components/ConnectKit';
import { useMetaMaskConnector } from './../useConnectors';

type Props = {
  enabled?: boolean;
};

export function useMetaMaskUri(
  { enabled }: Props = {
    enabled: true,
  }
) {
  const { log } = useContext();

  const [uri, setUri] = useState<string | undefined>(undefined);

  const connector = useMetaMaskConnector();
  const shouldConnect = enabled;

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    window.addEventListener('metaMaskUri', (e: any) => {
      console.log('link', e.detail);
      setUri(e.detail);
    });
  }, []);

  useEffect(() => {
    if (!shouldConnect) return;

    async function handleMessage(message) {
      const { type } = message;
      log('MM Message', message);
      if (type === 'connecting') {
        const p: any = await connector.getProvider();
        console.log('MM Provider');
        console.log(p);
        /*
        console.log('p', p);
        if (p?.qrUrl) setUri(p.qrUrl);*/
      }
    }
    async function handleDisconnect() {
      log('MM Disconnect');

      if (connector) connect(connector);
    }

    async function connect(connector: Connector) {
      console.log('connect');
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function tryConnect(connector: Connector) {
      console.log('tryConnect');
      try {
        await connect(connector);
      } catch (error: any) {
        log('catch error');
        log(error);
        if (error.code) {
          switch (error.code) {
            case 4001:
              log('error.code - User rejected');
              tryConnect(connector); // Regenerate QR code
              break;
            default:
              log('error.code - Unknown Error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          log('MetaMask Wallet cannot connect.', error);
        }
      }
    }

    if (!connector || uri) return;
    if (connector && !isConnected) {
      tryConnect(connector);
      connector.emitter.on('message', handleMessage);
      connector.emitter.on('disconnect', handleDisconnect);
      return () => {
        connector.emitter.off('message', handleMessage);
        connector.emitter.off('disconnect', handleDisconnect);
      };
    }
  }, [shouldConnect, connector, isConnected]);

  return {
    uri,
  };
}
