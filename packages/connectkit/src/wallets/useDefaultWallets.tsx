import { defaultWallets } from './';

import { useContext } from '../components/ConnectKit';
import { WalletProps } from './wallet';

export const useWallets = () => {
  const { wallets } = useContext();
  if (wallets) return wallets;

  return defaultWallets;
};

export const useWallet = (
  id: string
): {
  wallet?: WalletProps;
} => {
  const wallet = useWallets().find((wallet) => wallet.id === id);
  return { wallet };
};
