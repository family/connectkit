import { Connector, useNetwork } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { useConnect } from './useConnect';

export function useDefaultWalletConnect() {
  const { connectAsync, connectors } = useConnect();
  return {
    openDefaultWalletConnect: async () => {
      const c: Connector = connectors.find((c) => c.id === 'walletConnect');
      if (c) {
        const connector = new WalletConnectConnector({
          chains: c.chains,
          options: { qrcode: true },
        });

        try {
          await connectAsync(connector);
        } catch (err) {
          console.log('WalletConnect', err);
        }
      } else {
        console.log('No WalletConnect connector available');
      }
    },
  };
}
