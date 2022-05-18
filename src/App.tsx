import { providers } from 'ethers';
import { Provider, createClient, chain } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';

import { ConnectKitProvider, ConnectKitModal } from './ConnectKit';

import TestBench from './TestBench';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const infuraId = '34dfd61558944dbbb4a5187b330bed76';
const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const client = createClient({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains: chains,
      options: {
        infuraId,
        qrcode: false,
      },
    }),
    new MetaMaskConnector({
      chains: chains,
      options: {
        shimDisconnect: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains: chains,
      options: {
        appName: 'Family',
        headlessMode: true,
      },
    }),
  ],
  provider: (config) => {
    return new providers.InfuraProvider(config.chainId, infuraId);
  },
});

const App = () => {
  return (
    <Provider client={client}>
      <ConnectKitProvider>
        <TestBench />
      </ConnectKitProvider>
    </Provider>
  );
};

export default App;
