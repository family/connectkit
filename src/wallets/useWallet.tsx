import { useContext } from '../components/ConnectKit';

import { wallets } from '.';
import { useNetwork } from 'wagmi';

function useWallet(walletId: string) {
  const context = useContext();
  const { chains } = useNetwork();
  const wallet = wallets.filter((wallet) => wallet.name === walletId);

  if (!wallet.length) {
    context.debug('Cannot find wallet', walletId);
    return null;
  }
  return wallet[0]({ chains });
}

export default useWallet;
