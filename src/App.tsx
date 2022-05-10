import { providers } from 'ethers';
import { Provider, createClient } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';

import { FamilyProvider, FamilyConnectModal } from './FamilyKit';
import { useState } from 'react';
import { languages, theme } from './components/FamilyKit';

import QA from './components/QA';

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
    new MetaMaskConnector(),
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
  const [openQA, setOpenQA] = useState<boolean>(false);
  const [theme, setTheme] = useState<theme>('auto');
  const [lang, setLang] = useState<languages>('en');
  const [iframeUrl, setIframeUrl] = useState<string>('');
  return (
    <FamilyProvider>
      <Provider client={client}>
        {openQA ? (
          <>
            <button onClick={() => setOpenQA(false)}>Close QA</button>
            <div>
              <QA />
            </div>
          </>
        ) : (
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
            <FamilyConnectModal theme={theme} lang={lang} />
            <button onClick={() => setOpenQA(true)}>Open QA</button>

            <h1>Family Connect</h1>
            <p>This page is intentionally left unstyled</p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
              }}
            >
              <fieldset>
                options
                <hr />
                <label>theme</label>{' '}
                <select onChange={(e: any) => setTheme(e.target.value)}>
                  <option value={'auto'}>system settings</option>
                  <option value={'light'}>light mode</option>
                  <option value={'dark'}>dark mode</option>
                </select>
                <label>language</label>{' '}
                <select onChange={(e: any) => setLang(e.target.value)}>
                  <option value={'en'}>english</option>
                  <option value={'fr'}>french (google translated)</option>
                </select>
              </fieldset>
              <fieldset>
                design context preview
                <hr />
                <button
                  name="mirror.xyz"
                  onClick={() => {
                    setIframeUrl(
                      iframeUrl !== 'https://mirror.xyz'
                        ? 'https://mirror.xyz'
                        : ''
                    );
                  }}
                >
                  {iframeUrl === 'https://mirror.xyz' ? 'Disable' : 'Enable'}
                </button>{' '}
                <label>mirror.xyz</label>
                <hr />
                <button
                  onClick={() => {
                    setIframeUrl(
                      iframeUrl !== 'https://opensea.io'
                        ? 'https://opensea.io'
                        : ''
                    );
                  }}
                >
                  {iframeUrl === 'https://opensea.io' ? 'Disable' : 'Enable'}
                </button>{' '}
                <label>opensea</label>
                <hr />
                <button
                  onClick={() => {
                    setIframeUrl(
                      iframeUrl !== 'https://honk.me' ? 'https://honk.me' : ''
                    );
                  }}
                >
                  {iframeUrl === 'https://honk.me' ? 'Disable' : 'Enable'}
                </button>{' '}
                <label>honk</label>
                <hr />
                <button
                  onClick={() => {
                    setIframeUrl(
                      iframeUrl !== 'https://loch.ie' ? 'https://loch.ie' : ''
                    );
                  }}
                >
                  {iframeUrl === 'https://loch.ie' ? 'Disable' : 'Enable'}
                </button>{' '}
                <label>extreme stress test</label>
              </fieldset>
            </div>

            {iframeUrl !== '' && (
              <iframe
                src={iframeUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  inset: 0,
                  position: 'fixed',
                  zIndex: -1,
                  border: 0,
                }}
              />
            )}
          </div>
        )}
      </Provider>
    </FamilyProvider>
  );
};

export default App;
