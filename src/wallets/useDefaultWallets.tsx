import { getWallets } from '.';
import { WalletProps } from './wallet';

import { useNetwork } from 'wagmi';

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

function useDefaultWallets(): WalletProps[] | any {
  const { chains } = useNetwork();
  const wallets = getWallets({ chains });
  return wallets.filter((wallet) => defaultWallets.includes(wallet.id));
}

export default useDefaultWallets;
