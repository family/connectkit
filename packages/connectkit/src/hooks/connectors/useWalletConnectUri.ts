import { useState, useEffect } from 'react';

import { Connector, useAccount, useConnect } from 'wagmi';
import { useWalletConnectConnector } from './../useConnectors';

export function useWalletConnectUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const connector: Connector = useWalletConnectConnector();
  const isWalletConnectLegacy = connector?.id === 'walletConnectLegacy';

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    onError: (error: any) => console.log('error', error),
    onSuccess: (result: any) => console.log('success', result),
    onMutate: () => console.log('mutate'),
    onSettled: () => console.log('settled'),
  });

  useEffect(() => {
    async function handleMessage({ type, data }: any) {
      console.log('WC Message', type, data);
      if (isWalletConnectLegacy) {
        console.log('isWalletConnectLegacy');
        if (type === 'connecting') {
          const p = await connector.getProvider();
          setUri(p.connector.uri);

          // User rejected, regenerate QR code
          p.connector.on('disconnect', () => {
            console.log('User rejected, regenerate QR code');
            connectWalletConnect(connector);
          });
        }
      } else {
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
    }
    async function handleChange(e: any) {
      console.log('WC Change', e);
    }
    async function handleDisconnect() {
      console.log('WC Disconnect');

      if (connector) {
        if (connector.options?.version === '1') {
          connectWallet(connector);
        }
      }
    }
    async function handleConnect() {
      console.log('WC Connect');
    }
    async function handleError(e: any) {
      console.log('WC Error', e);
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
        console.log('catch error');
        console.log(error);
        if (error.code) {
          switch (error.code) {
            case 4001:
              console.log('error.code - User rejected');
              connectWalletConnect(connector); // Regenerate QR code
              break;
            default:
              console.log('error.code - Unknown Error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          console.log('WalletConnect cannot connect.', error);
        }
      }
    }

    if (!connector || uri) return;
    if (connector && !isConnected) {
      connectWalletConnect(connector);
      console.log('add wc listeners');
      connector.on('message', handleMessage);
      connector.on('change', handleChange);
      connector.on('connect', handleConnect);
      connector.on('disconnect', handleDisconnect);
      connector.on('error', handleError);
      return () => {
        console.log('remove wc listeners');
        connector.off('message', handleMessage);
        connector.off('change', handleChange);
        connector.off('connect', handleConnect);
        connector.off('disconnect', handleDisconnect);
        connector.off('error', handleError);
      };
    }
  }, [connector, isConnected]);

  return {
    uri,
  };
}
