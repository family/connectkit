import { injected } from './connectors/injected';
import { walletConnect } from './connectors/walletConnect';
import { metaMask } from './connectors/metaMask';
import { coinbaseWallet } from './connectors/coinbaseWallet';
import { rainbow } from './connectors/rainbow';
import { argent } from './connectors/argent';
import { trust } from './connectors/trust';
import { ledger } from './connectors/ledger';
import { imToken } from './connectors/imToken';
import { brave } from './connectors/brave';

export const wallets = {
  injected: injected,
  walletConnect: walletConnect,
  metaMask: metaMask,
  coinbaseWallet: coinbaseWallet,
  rainbow: rainbow,
  argent: argent,
  trust: trust,
  ledger: ledger,
  imToken: imToken,
  brave: brave,
};
