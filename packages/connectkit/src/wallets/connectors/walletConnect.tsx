import { WalletProps } from './../wallet';

import Logos from './../../assets/logos';
import { useContext } from '../../components/ConnectKit';
import useLocales from '../../hooks/useLocales';

export const walletConnect = (): WalletProps => {
  /*
  const context = useContext();
  const locales = useLocales();
  const name = context.options?.walletConnectName ?? locales.otherWallets;
  */
  return {
    id: 'walletConnect',
    name: `name`,
    logos: {
      default: <Logos.WalletConnect />,
      mobile: <Logos.OtherWallets />,
      transparent: <Logos.WalletConnect background={false} />,
      connectorButton: <Logos.OtherWallets />,
      qrCode: <Logos.WalletConnect background={true} />,
    },
    logoBackground: 'var(--ck-brand-walletConnect)',
    scannable: true,
    createUri: (uri: string) => uri,
  };
};
