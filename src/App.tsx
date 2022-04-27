import { providers } from 'ethers';
import { Provider, createClient, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';

import { FamilyProvider, FamilyConnectModal } from './FamilyKit';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const infuraId = '34dfd61558944dbbb4a5187b330bed76';
const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector(),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: false,
      },
    }),
    // new CoinbaseWalletConnector({
    //   options: {
    //     appName: 'Family App',
    //   },
    // }),
  ],
  provider: (config) => {
    return new providers.InfuraProvider(config.chainId, infuraId);
  },
});

const App = () => {
  return (
    <FamilyProvider>
      <Provider client={client}>
        <div
          style={{
            width: '100%',
            height: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <FamilyConnectModal />
          <h1>Family Connect</h1>
          <p>This page is intentionally left unstyled</p>
        </div>
      </Provider>
    </FamilyProvider>
  );
};

export default App;
