import { useState, useEffect } from 'react';

import { useConnect } from './useConnect';
import { useCoinbaseWalletConnector } from './connectors/useCoinbaseWalletConnector';
import { useContext } from '../components/ConnectKit';

export function useCoinbaseWalletUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const context = useContext();

  const { connector } = useCoinbaseWalletConnector();
  const { connectAsync } = useConnect();

  useEffect(() => {
    async function handleMessage(e: any) {
      console.log('CBW Message', e);
      if (connector) {
        if (e.type === 'connecting') {
          const p = await connector.getProvider();
          setUri(p.qrUrl);
        }
      }
    }
    if (connector) {
      console.log('add cbw listeners');
      connectCoinbaseWallet(connector);
      connector.on('message', handleMessage);
      return () => {
        console.log('remove cbw listeners');
        connector.off('message', handleMessage);
      };
    }
  }, [connector]);

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector });
    if (result) return result;
    return false;
  }

  async function connectCoinbaseWallet(connector: any) {
    try {
      await connectWallet(connector);
    } catch (err) {
      context.debug(
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
        err
      );
    }
  }

  return {
    uri,
  };
}
