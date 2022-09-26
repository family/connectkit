import { providers } from 'ethers';
import { WagmiConfig, createClient, allChains, Chain } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ConnectKitProvider, ConnectKitButton } from 'connectkit';

const chains = allChains.sort((a: Chain, b: Chain) =>
  a.name.localeCompare(b.name)
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains: chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: false,
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains: chains,
      options: {
        appName: 'Family',
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains: chains,
      options: {
        qrcode: false,
      },
    }),
    new InjectedConnector({
      chains: chains,
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
  ],
  provider: (config) => {
    return new providers.InfuraProvider(config.chainId);
  },
});

function App() {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <ConnectKitButton />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
