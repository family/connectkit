import { wallets } from '.';

const defaultWallets = [
  'metaMask',
  'coinbaseWallet',
  'rainbow',
  'argent',
  'trust',
  'ledger',
  'imToken',
  'brave',
];

import { useNetwork } from 'wagmi';
import { WalletProps } from './wallet';

function useDefaultWallets(): WalletProps[] | any {
  return defaultWallets.map((id) => useWallet(id)).filter((w) => w !== null);
}

function useWallet(walletId: string): WalletProps | null {
  const { chains } = useNetwork();
  const w = wallets.filter((wallet) => wallet.name === walletId);

  if (!w.length) {
    console.log('Cannot find walletId:', walletId);
    return null;
  }
  const wallet: WalletProps = w[0]({ chains });
  if (wallet) return wallet;
  return null;
}

export default useDefaultWallets;
