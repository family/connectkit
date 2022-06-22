import { getWallets } from '.';
import { WalletProps } from './wallet';

import { useNetwork, useConnect } from 'wagmi';

function useDefaultWallets(): WalletProps[] | any {
  const { chains } = useNetwork();
  const { connectors } = useConnect();

  let defaultWallets = [];

  // If missing metamask or coinbasewallet connector, add them to this list
  if (!connectors.find((c) => c.id === 'metaMask'))
    defaultWallets.push('metaMask');

  // TODO: Add coinbasewallet connector

  if (!connectors.find((c) => c.id === 'coinbaseWallet'))
    defaultWallets.push('coinbaseWallet');

  // Add default wallets
  defaultWallets.push(
    'rainbow',
    'argent',
    'trust',
    'ledger',
    'imToken',
    'brave'
  );

  const wallets = getWallets({ chains });
  return wallets.filter((wallet) => defaultWallets.includes(wallet.id));
}

export default useDefaultWallets;
