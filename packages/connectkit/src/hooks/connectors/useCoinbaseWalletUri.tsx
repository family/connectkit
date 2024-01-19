import { useState, useEffect } from 'react';
import { useContext } from './../../components/ConnectKit';

import { useConnect } from './../useConnect';
import { useCoinbaseWalletConnector } from './../useConnectors';
import { Connector, useAccount } from 'wagmi';
import { useWallet } from '../../wallets/useWallets';

type Props = {
  enabled?: boolean;
};

export function useCoinbaseWalletUri(
  { enabled }: Props = {
    enabled: true,
  }
) {
  const { log, displayError } = useContext();

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
    /*
    async function handleDisconnect() {
      log('CBW Disconnect');

      if (connector) connectWallet(connector);
    }
    */

    async function connectWallet(connector: Connector) {
      const result = await connectAsync({ connector });
      if (result) return result;
      return false;
    }

    async function connectCoinbaseWallet(connector: any) {
      try {
        await connectWallet(connector);
      } catch (error: any) {
        log(error);
        displayError(
          <>
            This dApp is most likely missing the <code>headlessMode: true</code>{' '}
            flag in the custom <code>CoinbaseWalletConnector</code> options. See{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://connect.family.co/v0/docs/cbwHeadlessMode"
            >
              documentation
            </a>{' '}
            for more details.
          </>,
          error
        );
      }
    }

    if (!connector || uri) return;
    if (connector && !isConnected) {
      connectCoinbaseWallet(connector);
      log('add wc listeners');
      connector.emitter.on('message', handleMessage);
      //connector.emitter.on('disconnect', handleDisconnect);
      return () => {
        log('remove wc listeners');
        connector.emitter.off('message', handleMessage);
        //connector.emitter.off('disconnect', handleDisconnect);
      };
    }
  }, [shouldConnect, connector, isConnected]);

  return {
    uri,
  };
}
