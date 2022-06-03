import { Chain, chain, configureChains } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';

const defaultChains = [
  chain.mainnet,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
];
const getDefaultConnectors = ({ chains, appName }: any) => {
  return [
    /*
  new InjectedConnector({
    chains: configuredChains,
    options: {
      name: 'LFE Wallet',
      shimDisconnect: true,
    },
  }),
  */
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        headlessMode: true,
      },
    }),
  ];
};
type DefaultClientProps = {
  appName?: string;
  chains?: Chain[];
  alchemyId?: string;
  infuraId?: string;
  connectors?: any;
};
const defaultClient: any = ({
  appName = 'ConnectKit',
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
}: DefaultClientProps) => {
  const providers = [];

  if (alchemyId) providers.push(alchemyProvider({ alchemyId }));
  if (infuraId) providers.push(infuraProvider({ infuraId }));
  providers.push(publicProvider());

  providers.push(
    jsonRpcProvider({
      rpc: (c) => {
        if (c.id !== chain.mainnet.id) return null;
        return { http: c.rpcUrls.default };
      },
    })
  );

  const { provider, chains: configuredChains } = configureChains(
    chains,
    providers
  );

  const connectKitClient = {
    autoConnect: true,
    connectors:
      connectors ?? getDefaultConnectors({ chains: configuredChains, appName }),
    provider,
  };

  return { ...connectKitClient };
};

export default defaultClient;
