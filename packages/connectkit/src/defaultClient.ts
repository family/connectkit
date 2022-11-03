import {
  Chain,
  Connector,
  chain,
  configureChains,
  ChainProviderFn,
} from 'wagmi';
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
let globalAppIcon: string;
export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

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
  appIcon?: string;
  autoConnect?: boolean;
  alchemyId?: string;
  infuraId?: string;
  chains?: Chain[];
  connectors?: any;
  provider?: any;
};

type ConnectKitClientProps = {
  autoConnect?: boolean;
  connectors?: Connector[];
  provider: Provider;
  webSocketProvider?: any;
};

const getDefaultConnectors = ({ chains, appName }: DefaultConnectorsProps) => {
  return [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
        UNSTABLE_shimOnConnectSelectAccount: true,
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
        shimDisconnect: true,
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
  appIcon,
  chains = defaultChains,
  alchemyId,
  infuraId,
  connectors,
  provider,
}: DefaultClientProps) => {
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const providers: ChainProviderFn[] = [];
  if (alchemyId) {
    providers.push(alchemyProvider({ apiKey: alchemyId, stallTimeout: 5000 }));
  }
  if (infuraId) {
    providers.push(infuraProvider({ apiKey: infuraId, stallTimeout: 5000 }));
  }
  providers.push(
    jsonRpcProvider({
      rpc: (c) => {
        if (c.id !== chain.mainnet.id) return null;
        return { http: c.rpcUrls.default };
      },
      stallTimeout: 5000,
    })
  );
  providers.push(publicProvider());

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
    //webSocketProvider,
  };

  return { ...connectKitClient };
};

export default defaultClient;
