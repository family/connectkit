import { useState } from 'react';
import {
  useConnect,
  useSendTransaction,
  useSignMessage,
  useSignTypedData,
} from 'wagmi';
import { BigNumber } from 'ethers';

import { ConnectKitModal } from './ConnectKit';
import { Languages, Theme } from './components/ConnectKit';
import { ConnectKitButton } from './components/ConnectButton';

import QA from './components/QA';
import { motion } from 'framer-motion';

// All properties on a domain are optional
const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
};

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
};

const value = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  },
  contents: 'Hello, Bob!',
};

const TestBench = () => {
  const [openQA, setOpenQA] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('auto');
  const [lang, setLang] = useState<Languages>('en');
  const [iframeUrl, setIframeUrl] = useState<string>('');

  const { isConnected } = useConnect();
  const {
    signMessage,
    isLoading: signMessageIsLoading,
    isError: signMessageIsError,
  } = useSignMessage({
    message: 'fam token wen',
  });
  const {
    signTypedData,
    isLoading: signTypedDataIsLoading,
    isError: signTypedDataIsError,
  } = useSignTypedData({
    domain,
    types,
    value,
  });
  const {
    sendTransaction,
    isLoading: sendTransactionIsLoading,
    isError: sendTransactionIsError,
  } = useSendTransaction({
    request: {
      to: 'lochie.eth', // Using my address so I can manually refund if accidental txn goes through
      value: BigNumber.from('0'),
    },
  });

  const testSignMessage = () => {
    signMessage();
  };
  const testSignTypedData = () => {
    signTypedData();
  };
  const testSendTransaction = () => {
    sendTransaction();
  };

  return (
    <div>
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
            gap: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ConnectKitModal theme={theme} lang={lang} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <ConnectKitButton />
            <ConnectKitButton />
            <ConnectKitButton />
          </div>
          <div>
            <ConnectKitButton.Custom>
              {({ isConnected, show, hide, truncatedAddress }) => {
                return (
                  <motion.div
                    onClick={show}
                    style={{
                      display: 'inline-block',
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
                    {isConnected ? truncatedAddress : 'Custom Connect'}
                  </motion.div>
                );
              }}
            </ConnectKitButton.Custom>
          </div>
          <div>
            <button onClick={() => setOpenQA(true)}>Open QA</button>
          </div>
          <div>
            <h1>ConnectKit by Family</h1>
            <p>This page is intentionally left unstyled</p>
          </div>
          <div>
            <div
              style={{
                display: 'flex',
              }}
            >
              <fieldset
                style={{
                  background: 'white',
                }}
              >
                <h3>options</h3>
                <div>
                  <label>theme</label>{' '}
                  <select onChange={(e: any) => setTheme(e.target.value)}>
                    <option value={'auto'}>system settings</option>
                    <option value={'light'}>light mode</option>
                    <option value={'dark'}>dark mode</option>
                  </select>
                </div>
                <div>
                  <label>language</label>{' '}
                  <select onChange={(e: any) => setLang(e.target.value)}>
                    <option value={'en'}>english</option>
                    <option value={'fr'}>french (google translated)</option>
                  </select>
                </div>
                <hr />
                <h3>actions {!isConnected && `(connect to test)`}</h3>
                <div>
                  <button disabled={!isConnected} onClick={testSignMessage}>
                    sign message
                  </button>
                  {signMessageIsLoading && 'Loading'}
                  {signMessageIsError && `Error. check console`}
                </div>
                <div>
                  <button disabled={!isConnected} onClick={testSignTypedData}>
                    sign typed data
                  </button>
                  {signTypedDataIsLoading && 'Loading'}
                  {signTypedDataIsError && `Error. check console`}
                </div>
                <div>
                  <button disabled={!isConnected} onClick={testSendTransaction}>
                    send transaction
                  </button>
                  {sendTransactionIsLoading && 'Loading'}
                  {sendTransactionIsError && `Error. check console`}
                </div>
              </fieldset>
              <fieldset
                style={{
                  background: 'white',
                }}
              >
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
                      iframeUrl !== 'https://context.app'
                        ? 'https://context.app'
                        : ''
                    );
                  }}
                >
                  {iframeUrl === 'https://context.app' ? 'Disable' : 'Enable'}
                </button>{' '}
                <label>context</label>
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
          </div>

          {iframeUrl !== '' && (
            <>
              <div style={{ height: '200vh' }} />
              <iframe
                title="preview"
                scrolling="no"
                src={iframeUrl}
                style={{
                  width: '100vw',
                  height: '100%',
                  inset: 0,
                  position: 'fixed',
                  zIndex: -1,
                  border: 0,
                }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TestBench;
