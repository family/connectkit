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
  const w = Object.keys(wallets).filter((key) => key === walletId);
  const walletName = w[0];

  if (!walletName) {
    console.log('Cannot find walletId:', walletId);
    return null;
  }

  const { chains } = useNetwork();
  const wallet: WalletProps = wallets[walletName]({ chains });
  if (wallet) return wallet;
  return null;
}

export default useDefaultWallets;
