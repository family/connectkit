import * as wallets from './exports';
import { WalletProps } from './wallet';

export const defaultWallets: WalletProps[] = [
  wallets.injected(),
  wallets.metaMask(),
  wallets.coinbaseWallet(),
  wallets.walletConnect(),
  wallets.zerion(),
  wallets.family(),
  wallets.imToken(),
  wallets.rainbow(),
  wallets.argent(),
  wallets.trust(),
  wallets.ledger(),
  wallets.brave(),
  wallets.safe(),
  wallets.slope(),
  wallets.unstoppable(),
  wallets.steak(),
  wallets.onto(),
  wallets.frontier(),
].sort((a, b) => a.id.localeCompare(b.id));
