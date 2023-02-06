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
    if (connector) connectCoinbaseWallet(connector);
  }, [connector]);

  async function connectWallet(connector: any) {
    const result = await connectAsync({ connector });
    if (result) return result;
    return false;
  }

  async function connectCoinbaseWallet(connector: any) {
    connector.on('message', async (e) => {
      const p = await connector.getProvider();
      setUri(p.qrUrl);
    });
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
