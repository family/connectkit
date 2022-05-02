import { providers } from 'ethers';
import { Provider, createClient, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';

import { FamilyProvider, FamilyConnectModal } from './FamilyKit';
import { useState } from 'react';

if (!window.Buffer) {
  window.Buffer = Buffer;
}

const infuraId = '34dfd61558944dbbb4a5187b330bed76';
const client = createClient({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: false,
      },
    }),
    new InjectedConnector(),
    new CoinbaseWalletConnector({
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
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
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
          <FamilyConnectModal theme={theme} />

          <h1>Family Connect</h1>
          <p>This page is intentionally left unstyled</p>
          <label>Theme</label>
          <select onChange={(e: any) => setTheme(e.target.value)}>
            <option value={'auto'}>auto</option>
            <option value={'light'}>Light Mode</option>
            <option value={'dark'}>Dark Mode</option>
          </select>
        </div>
      </Provider>
    </FamilyProvider>
  );
};

export default App;
