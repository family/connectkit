import { useNetwork } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { useConnect } from './useConnect';

export function useDefaultWalletConnect() {
  const { connectAsync } = useConnect();
  const { chains } = useNetwork();

  return {
    openDefaultWalletConnect: async () => {
      const connector = new WalletConnectConnector({
        chains,
        options: { qrcode: true },
      });

      try {
        await connectAsync(connector);
      } catch (err) {
        console.log('WalletConnect', err);
      }
    },
  };
}
