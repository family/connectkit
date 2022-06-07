import { Chain, Connector, chain, configureChains } from 'wagmi';
import { Provider } from '@wagmi/core';

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

type DefaultConnectorsProps = {
  chains?: Chain[];
  appName?: string;
};
type DefaultClientProps = {
  appName?: string;
  alchemyId?: string;
  infuraId?: string;
  chains?: Chain[];
  connectors?: any;
  provider?: any;
};
type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  provider?: Provider;
};
const getDefaultConnectors = ({ chains, appName }: DefaultConnectorsProps) => {
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
const defaultClient = ({
  appName = 'ConnectKit',
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  provider,
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

  const { provider: configuredProvider, chains: configuredChains } =
    configureChains(chains, providers);

  const connectKitClient: ConnectKitClientProps = {
    autoConnect: true,
    connectors:
      connectors ?? getDefaultConnectors({ chains: configuredChains, appName }),
    provider: provider ?? configuredProvider,
  };

  return { ...connectKitClient };
};

export default defaultClient;
