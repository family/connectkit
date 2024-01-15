import { useState, useEffect } from 'react';
import { useContext } from './../../components/ConnectKit';

import { useConnect } from './../useConnect';
import { useCoinbaseWalletConnector } from './../useConnectors';
import { ProviderMessage } from 'viem';

export function useCoinbaseWalletUri() {
  const [uri, setUri] = useState<string | undefined>(undefined);

  const context = useContext();

  const connector = useCoinbaseWalletConnector();
  const { connectAsync } = useConnect();

  useEffect(() => {
    if (connector) {
      connector.onMessage = async (message: ProviderMessage) => {
        context.log('CBW Message', message);
        if (connector) {
          if (message.type === 'connecting') {
            const p: any = await connector.getProvider();
            if (p?.qrUrl) setUri(p.qrUrl);
          }
        }
      };
      connectCoinbaseWallet(connector);
    }
  }, [connector]);

  async function connectWallet(connector: any) {
    const result = await connectAsync({
      connector,
    });
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
