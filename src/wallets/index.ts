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
import { steak } from './connectors/steak';
import { unstoppable } from './connectors/unstoppable';
import { slope } from './connectors/slope';
import { onto } from './connectors/onto';
import { gnosisSafe } from './connectors/gnosisSafe';
import { Chain } from 'wagmi';

export const getWallets = ({
  chains,
}: {
  chains: Chain[];
  appName?: string;
  shimDisconnect?: boolean;
}) => {
  return [
    injected({ chains }),
    walletConnect({ chains }),
    metaMask({ chains }),
    coinbaseWallet({ chains }),
    rainbow({ chains }),
    argent({ chains }),
    trust({ chains }),
    ledger({ chains }),
    imToken({ chains }),
    brave({ chains }),
    steak({ chains }),
    unstoppable({ chains }),
    slope({ chains }),
    onto({ chains }),
    gnosisSafe({ chains }),
  ];
};
