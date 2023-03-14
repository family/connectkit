import { Connector } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
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

      const clientConnector: Connector<any, any> | undefined = connectors.find(
        (c) => isWalletConnectConnector(c.id)
      );
      if (clientConnector) {
        let connector: WalletConnectConnector | WalletConnectLegacyConnector;

        if (clientConnector.id === 'walletConnectLegacy') {
          connector = new WalletConnectLegacyConnector({
            ...clientConnector,
            options: {
              ...clientConnector.options,
              qrcode: true,
            },
          });
        } else {
          connector = new WalletConnectConnector({
            ...clientConnector,
            options: {
              ...clientConnector.options,
              showQrModal: true,
            },
          });
        }

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
