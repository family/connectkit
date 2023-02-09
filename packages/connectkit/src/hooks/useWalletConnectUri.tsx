import { useState, useEffect } from 'react';

import { useAccount, useConnect } from 'wagmi';
import { useWalletConnectConnector } from './connectors/useWalletConnectConnector';

export function useWalletConnectUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const { connector } = useWalletConnectConnector({});
  const { isConnected } = useAccount();
  const { connectAsync } = useConnect({
    onError: (error: any) => console.log('error', error),
    onSuccess: (result: any) => console.log('success', result),
    onMutate: () => console.log('mutate'),
    onSettled: () => console.log('settled'),
  });

  useEffect(() => {
    async function handleMessage(e: any) {
      console.log('WC Message', e);
      if (connector) {
        if (connector.options?.version === '1') {
          // Wallet Connect v1
          const p = await connector.getProvider();
          setUri(p.connector.uri);
        } else {
          // Wallet Connect v2
          switch (e.type) {
            case 'display_uri':
              setUri(e.data);
              break;
            /*
            case 'connecting':
              const p = await connector.getProvider();
              setUri(p.uri);
              break;
              */
            default:
              console.log('unknown message type', e.type);
          }
        }
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

    async function connectWallet(connector: any) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectWalletConnect(connector: any) {
      if (!connector) console.log('no connector found to connect to');
      if (connector.options?.version === '1') {
        // Wallet Connect v1
        try {
          await connectWallet(connector);
        } catch (err) {
          console.log(
            'WalletConnect cannot connect. See console for more details.',
            err
          );
        }
      } else {
        // Wallet Connect v2
        try {
          console.log('try to connect', connector);
          // Wait for user to approve
          await connectWallet(connector);
        } catch (error: any) {
          console.log('cannot connect', error);

          if (error) {
            if (error.code) {
              switch (error.code) {
                // If user rejects regenerate URI or WalletConnect does something unexpected
                case 4001:
                  console.log('User rejected', error.code, error);
                  connectWalletConnect(connector); // Regenerate QR code
                  break;
                case -32000:
                  console.log('Failed to process request', error.code, error);
                  connectWalletConnect(connector); // Regenerate QR code
                  break;
                default:
                  console.log(
                    'Unknown error. User will probably need to reload app...',
                    error.code,
                    error
                  );
                  break;
              }
            } else {
              // Sometimes the error doesn't respond with a code
              console.log('WalletConnect cannot connect.', error);
            }
          }
        }
      }
    }
  }, [connector, isConnected]);

  return {
    uri,
  };
}
