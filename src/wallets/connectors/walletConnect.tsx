import { WalletProps, WalletOptions } from './../wallet';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import Logos from './../../assets/logos';
import { isMobile } from '../../utils';

export const walletConnect = ({ chains }: WalletOptions): WalletProps => {
  return {
    id: 'walletConnect',
    name: 'Other Wallets',
    logos: {
      default: <Logos.WalletConnect />,
      mobile: <Logos.OtherWallets />,
      transparent: <Logos.WalletConnect background={false} />,
      connectorButton: <Logos.OtherWallets />,
      qrCode: <Logos.WalletConnect background={true} />,
    },
    logoBackground: 'var(--brand-walletConnect)',
    scannable: true,
    createConnector: () => {
      const connector = new WalletConnectConnector({
        chains,
        options: {
          qrcode: isMobile(),
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
