import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiConfig, createClient } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siwe } from '../siwe';
import { useState } from 'react';

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();

  // SIWE provider needs to be the outer-most provider because the connect kit
  // provider depends on some of the state

  return (
    <siwe.Provider>
      <ConnectKitProvider
        theme={theme}
        mode={mode}
        options={options}
        customTheme={customTheme}
      >
        <Component {...pageProps} />
      </ConnectKitProvider>
    </siwe.Provider>
  );
}
function MyApp(appProps: AppProps) {
  const [version, setVersion] = useState('1');

  const client = createClient(
    getDefaultClient({
      //chains: [mainnet, polygon],
      appName: 'ConnectKit testbench',
      appIcon: '/app.png',
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
      alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
      // WalletConnect 2.0
      walletConnectOptions:
        version === '1'
          ? {
              version: '1',
            }
          : {
              version: '2',
              projectId: process.env
                .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
            },
    })
  );
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>ConnectKit Testbench</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <WagmiConfig client={client}>
        <TestBenchProvider
        //customTheme={{ '--ck-font-family': 'monospace' }}
        >
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <button onClick={() => setVersion('1')} disabled={version === '1'}>
              Use WalletConnect V1
            </button>
            <button onClick={() => setVersion('2')} disabled={version === '2'}>
              Use WalletConnect V2
            </button>
          </div>
          <App {...appProps} />
        </TestBenchProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
