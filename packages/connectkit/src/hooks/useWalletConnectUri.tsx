import { useState, useEffect } from 'react';

import { useConnect } from './useConnect';
import { useWalletConnectConnector } from './connectors/useWalletConnectConnector';
import { useContext } from '../components/ConnectKit';

export function useWalletConnectUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const context = useContext();

  const { connector } = useWalletConnectConnector({});
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (connector) connectWalletConnect(connector);
  }, [connector]);

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector });
    if (result) return result;
    return false;
  }

  async function connectWalletConnect(connector: any) {
    if (connector.options?.version === '1') {
      connector.on('message', async (e) => {
        //@ts-ignore
        const p = await connector.getProvider();
        setUri(p.connector.uri);

        // User rejected, regenerate QR code
        p.connector.on('disconnect', () => {
          connectWallet(connector);
        });
      });
      try {
        await connectWallet(connector);
      } catch (err) {
        context.debug(
          <>WalletConnect cannot connect. See console for more details.</>,
          err
        );
      }
    } else {
      connector.on('message', async (e) => {
        const p = await connector.getProvider();
        setUri(p.uri);
        console.log(p.uri);

        // User rejected, regenerate QR code
        connector.on('disconnect', () => {
          console.log('disconnect');
        });
        connector.on('error', () => {
          console.log('disconnect');
        });
      });

      try {
        await connectWallet(connector);
      } catch (error: any) {
        if (error.code) {
          switch (error.code) {
            case 4001:
              console.error('User rejected');
              connectWalletConnect(connector); // Regenerate QR code
              break;
            default:
              console.error('Unknown error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          context.debug(
            <>WalletConnect cannot connect. See console for more details.</>,
            error
          );
        }
      }
    }
  }

  return {
    uri,
  };
}
