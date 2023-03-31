import { getWallets } from './';

import { useContext } from '../components/ConnectKit';
import { WalletProps } from './wallet';

export const useWallets = () => {
  const { wallets } = useContext();
  if (wallets) return wallets;

  return getWallets();
};

export const useWallet = (
  id: string
): {
  wallet?: WalletProps;
} => {
  const wallet = useWallets().find((wallet) => wallet.id === id);
  return { wallet };
};
