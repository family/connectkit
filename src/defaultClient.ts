import { Chain, Connector, chain, configureChains } from 'wagmi';
import { Provider, WebSocketProvider } from '@wagmi/core';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

const defaultChains = [
  chain.mainnet,
  chain.polygon,
  chain.optimism,
  chain.arbitrum,
];

type DefaultConnectorsProps = {
  chains?: Chain[];
  appName: string;
};
type DefaultClientProps = {
  autoConnect?: boolean;
  appName: string;
  alchemyId?: string;
  infuraId?: string;
  chains?: Chain[];
  connectors?: Connector[];
  provider?: Provider;
};

type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  provider: any; // TODO: Add missing type
  webSocketProvider?: any; // TODO: Add missing type
};

const getDefaultConnectors = ({ chains, appName }: DefaultConnectorsProps) => {
  return [
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
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === 'string'
              ? detectedName
              : detectedName.join(', ')
          })`,
      },
    }),
  ];
};
const defaultClient = ({
  autoConnect = true,
  appName = 'ConnectKit',
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  provider,
}: DefaultClientProps) => {
  const providers = [];

  //if (!infuraId && !alchemyId) alchemyId = 'ourDefaultAlchemyId';

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

  const {
    provider: configuredProvider,
    chains: configuredChains,
    webSocketProvider,
  } = configureChains(chains, providers);

  const connectKitClient: ConnectKitClientProps = {
    autoConnect,
    connectors:
      connectors ?? getDefaultConnectors({ chains: configuredChains, appName }),
    provider: provider ?? configuredProvider,
    webSocketProvider,
  };

  return { ...connectKitClient };
};

export default defaultClient;
