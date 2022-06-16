import { WalletProps } from './wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { isMobile } from '../utils';
import Logos from './../assets/logos';

export const walletConnect = ({ chains }): WalletProps => {
  return {
    id: 'walletConnect',
    name: 'WalletConnect',
    logo: <Logos.WalletConnect />,
    scannable: true,
    createConnector: () => {
      const connector = new WalletConnectConnector({
        chains,
        options: {
          qrcode: isMobile(),
          //rpc,
        },
      });

      const getUri = async () => (await connector.getProvider()).connector.uri;

      return {
        connector,
        qrCode: { getUri },
      };
    },
  };
};
