import { providers } from 'ethers';
import { Provider, createClient, chain } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { Buffer } from 'buffer';

import { ConnectKitProvider, ConnectKitModal } from './FamilyKit';
import { useState } from 'react';
import { Languages, Theme } from './components/FamilyKit';

import QA from './components/QA';
import { FpsView } from 'react-fps';
import { ConnectKitButton } from './components/ConnectButton';

import { motion } from 'framer-motion';

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
  const [openQA, setOpenQA] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('auto');
  const [lang, setLang] = useState<Languages>('en');
  const [iframeUrl, setIframeUrl] = useState<string>('');

  return (
    <Provider client={client}>
      <ConnectKitProvider>
        <FpsView />
        {openQA ? (
          <>
            <button onClick={() => setOpenQA(false)}>Close QA</button>
            <div>
              <QA setTheme={setTheme} setLang={setLang} theme={theme} />
            </div>
          </>
        ) : (
          <div
            style={{
              position: 'relative',
              padding: 64,
              height: '200vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <ConnectKitModal theme={theme} lang={lang} />
            <ConnectKitButton />

            <ConnectKitButton.Custom>
              {({ isConnected, show, hide, address }) => {
                return (
                  <motion.div
                    onClick={show}
                    style={{
                      fontSize: 15,
                      fontFamily: 'Avenir',
                      fontWeight: 700,
                      padding: '8px 16px',
                      borderRadius: 40,
                      background: '#fffc00',
                      cursor: 'pointer',
                      lineHeight: '24px',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isConnected ? address : 'Custom Connect'}
                  </motion.div>
                );
              }}
            </ConnectKitButton.Custom>

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
                scrolling="no"
                src={iframeUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  inset: 0,
                  position: 'absolute',
                  zIndex: -1,
                  border: 0,
                }}
              />
            )}
          </div>
        )}
      </ConnectKitProvider>
    </Provider>
  );
};

export default App;
