import { useEffect, useState } from 'react';

import { useInjectedConnector } from '../useConnectors';
import { isCoinbaseWallet, isMetaMask } from '../../utils';
import useDefaultWallets from '../../wallets/useDefaultWallets';
import { WalletProps } from '../../wallets/wallet';

export const useInjectedWallet = () => {
  const wallets = useDefaultWallets();
  const [wallet, setWallet] = useState<WalletProps | null>(null);

  const connector = useInjectedConnector();

  useEffect(() => {
    if (!connector) return;
    const findWallet = findInfo(connector.name);
    if (findWallet.length > 0) setWallet(findWallet[0]);
  }, [connector]);

  const shouldDisplayConnector = () => {
    return (
      typeof window !== 'undefined' &&
      window?.ethereum &&
      !isMetaMask() &&
      !isCoinbaseWallet()
    );
  };

  const findInfo = (name: string) => {
    let walletList = name.split(/[(),]+/);
    walletList.shift(); // remove "Injected" from array
    walletList = walletList.map((x) => x.trim()).filter((x) => x !== '');

    const findWallets: any = walletList.flatMap((x) => {
      const a = wallets.filter((wallet: any) => wallet.name.includes(x));
      if (a) return a;
      return null;
    });

    if (!findWallets) return null;
    return findWallets;
  };

  return {
    wallet,
    shouldDisplay: shouldDisplayConnector,
  };
};
