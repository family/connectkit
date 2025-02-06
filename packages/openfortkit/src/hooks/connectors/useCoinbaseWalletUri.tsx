/*
 * DEPRECATED
 *
 * This file is no longer in use and will be removed in the future.
 * Keeping it here for reference purposes only.
 */
/*
import { useState, useEffect } from 'react';

import { Connector, useAccount } from 'wagmi';
import { useConnect } from './../useConnect';
import { useContext } from '../../components/ConnectKit';
import { useCoinbaseWalletConnector } from './../useConnectors';
import { useWallet } from '../../wallets/useWallets';

type Props = {
  enabled?: boolean;
};

export function useCoinbaseWalletUri(
  { enabled }: Props = {
    enabled: true,
  }
) {
  const { log } = useContext();

  const [uri, setUri] = useState<string | undefined>(undefined);

  const connector = useCoinbaseWalletConnector();
  const wallet = useWallet('com.coinbase.wallet');
  const shouldConnect = enabled && !wallet;

  const { isConnected } = useAccount();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (!shouldConnect) return;

    async function handleMessage(message) {
      const { type } = message;
      log('CBW Message', message);
      if (type === 'connecting') {
        const p: any = await connector.getProvider();
        if (p?.qrUrl) setUri(p.qrUrl);
      }
    }
    async function handleDisconnect() {
      log('CBW Disconnect');

      if (connector) connectWallet(connector);
    }

    async function connectWallet(connector: Connector) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectCoinbaseWallet(connector: Connector) {
      try {
        await connectWallet(connector);
      } catch (error: any) {
        log('catch error');
        log(error);
        if (error.code) {
          switch (error.code) {
            case 4001:
              log('error.code - User rejected');
              connectCoinbaseWallet(connector); // Regenerate QR code
              break;
            default:
              log('error.code - Unknown Error');
              break;
          }
        } else {
          // Sometimes the error doesn't respond with a code
          log('Coinbase Wallet cannot connect.', error);
        }
      }
    }

    if (!connector || uri) return;
    if (connector && !isConnected) {
      connectCoinbaseWallet(connector);
      log('add wc listeners');
      connector.emitter.on('message', handleMessage);
      connector.emitter.on('disconnect', handleDisconnect);
      return () => {
        log('remove wc listeners');
        connector.emitter.off('message', handleMessage);
        connector.emitter.off('disconnect', handleDisconnect);
      };
    }
  }, [shouldConnect, connector, isConnected]);

  return {
    uri,
  };
}

*/
