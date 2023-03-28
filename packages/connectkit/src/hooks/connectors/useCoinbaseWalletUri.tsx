import { useState, useEffect } from 'react';
import { useContext } from './../../components/ConnectKit';

import { useConnect } from './../useConnect';
import { useCoinbaseWalletConnector } from './../useConnectors';

export function useCoinbaseWalletUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const context = useContext();

  const connector = useCoinbaseWalletConnector();
  const { connectAsync } = useConnect();

  useEffect(() => {
    async function handleMessage(e: any) {
      context.log('CBW Message', e);
      if (connector) {
        if (e.type === 'connecting') {
          const p = await connector.getProvider();
          setUri(p.qrUrl);
        }
      }
    }
    if (connector) {
      context.log('add cbw listeners');
      connectCoinbaseWallet(connector);
      connector.on('message', handleMessage);
      return () => {
        context.log('remove cbw listeners');
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
    } catch (error: any) {
      context.log(error);
      context.displayError(
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

  return {
    uri,
  };
}
