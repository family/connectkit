import { Connector } from 'wagmi';
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy';
import { isWalletConnectConnector } from '../utils';

import { useConnect } from './useConnect';

export function useDefaultWalletConnect() {
  const { connectAsync, connectors } = useConnect();
  return {
    openDefaultWalletConnect: async () => {
      //add modal styling because wagmi does not let you add styling to the modal
      const w3mcss = document.createElement('style');
      w3mcss.innerHTML = `w3m-modal{ --w3m-modal-z-index:2147483647; }`;
      document.head.appendChild(w3mcss);

      const c: Connector<any, any> | undefined = connectors.find((c) =>
        isWalletConnectConnector(c.id)
      );
      if (c) {
        const connector = new WalletConnectLegacyConnector({
          chains: c.chains,
          options: { ...c.options, qrcode: true },
        });

        try {
          await connectAsync({ connector: connector });
        } catch (err) {
          console.log('WalletConnect', err);
        }

        // remove modal styling
        document.head.removeChild(w3mcss);
      } else {
        console.log('No WalletConnect connector available');
      }
    },
  };
}
