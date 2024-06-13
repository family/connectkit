import { useState, useEffect } from 'react';

import { Connector, useAccount } from 'wagmi';
import { useContext } from '../../components/ConnectKit';
import { useConnect } from '../useConnect';
import { useWalletConnectConnector } from './../useConnectors';

type Props = {
  enabled?: boolean;
};

export function useWalletConnectUri(
  { enabled }: Props = {
    enabled: true,
  }
) {
  const { log } = useContext();

  const [uri, setUri] = useState<string | undefined>(undefined);

  const connector: Connector = useWalletConnectConnector();

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (!enabled) return;

    async function handleMessage(message) {
      const { type, data } = message;
      log('WC Message', type, data);
      if (type === 'display_uri') {
        setUri(data);
      }
      /*
        // This has the URI as well, but we're probably better off using the one in the display_uri event
        if (type === 'connecting') {
          const p = await connector.getProvider();
          const uri = p.signer.uri; 
          setConnectorUri(uri);
        }
        */
    }
    async function handleDisconnect() {
      log('WC Disconnect');

      if (connector) connectWallet(connector);
    }

    async function connectWallet(connector: Connector) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectWalletConnect(connector: Connector) {
      try {
        await connectWallet(connector);
      } catch (error: any) {
        log('catch error');
        log(error);
        if (error.code) {
          switch (error.code) {
            case 4001:
              log('error.code - User rejected');
              connectWalletConnect(connector); // Regenerate QR code
              break;
            default:
              log('error.code - Unknown Error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          log('WalletConnect cannot connect.', error);
        }
      }
    }
    if (isConnected) {
      setUri(undefined);
    } else {
      if (!connector || uri) return;
      if (connector && !isConnected) {
        connectWalletConnect(connector);
        log('add wc listeners');
        connector.emitter.on('message', handleMessage);
        connector.emitter.on('disconnect', handleDisconnect);
        return () => {
          log('remove wc listeners');
          connector.emitter.off('message', handleMessage);
          connector.emitter.off('disconnect', handleDisconnect);
        };
      }
    }
  }, [enabled, connector, isConnected]);

  return {
    uri,
  };
}
