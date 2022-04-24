import { providers } from 'ethers';
import { Provider, createClient, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import ConnectModal from './components/ConnectModal';
import { FamilyProvider } from './components/FamilyKit';

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
        // infuraId,
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
    console.log(config);
    return new providers.InfuraProvider(config.chainId, infuraId);
  },
});

const TemporaryContainer = styled(motion.div)`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App = () => {
  return (
    <FamilyProvider>
      <Provider client={client}>
        <TemporaryContainer>
          <ConnectModal />
        </TemporaryContainer>
      </Provider>
    </FamilyProvider>
  );
};

export default App;
