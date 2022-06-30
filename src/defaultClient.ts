import { Chain, Connector, chain, configureChains } from 'wagmi';
import { Provider } from '@wagmi/core';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

let globalAppName: string;
export const getAppName = () => globalAppName;

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
  appName: string;
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
  appName = 'ConnectKit',
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  provider,
}: DefaultClientProps) => {
  globalAppName = appName;
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
