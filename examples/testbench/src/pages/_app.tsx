import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiProvider, createConfig } from 'wagmi';
import {
  ConnectKitProvider,
  getDefaultConfig,
  SIWESession,
  wallets,
} from 'connectkit';

import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siweClient } from '../utils/siweClient';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ckConfig = getDefaultConfig({
  appName: 'ConnectKit testbench',
  appIcon: '/app.png',
  infuraApiKey: process.env.NEXT_PUBLIC_INFURA_ID,
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
});

const config = createConfig({
  ...ckConfig,
  connectors: [wallets.family, ...(ckConfig.connectors ?? [])],
});
const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();

  const key = JSON.stringify({ customTheme });

  // SIWE provider needs to be the outer-most provider because the connect kit
  // provider depends on some of the state

  useEffect(() => {
    console.log('App rendered');
  }, [customTheme]);

  return (
    <siweClient.Provider
      onSignIn={(data?: SIWESession) => {
        console.log('onSignIn Provider', data);
      }}
      onSignOut={() => {
        console.log('onSignOut Provider');
      }}
    >
      <ConnectKitProvider
        key={key}
        theme={theme}
        mode={mode}
        options={options}
        customTheme={customTheme}
        onConnect={(data) => {
          console.log('onConnect Provider', data);
        }}
        onDisconnect={() => {
          console.log('onDisconnect Provider');
        }}
        debugMode
      >
        <Component {...pageProps} />
      </ConnectKitProvider>
    </siweClient.Provider>
  );
}
function MyApp(appProps: AppProps) {
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
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <TestBenchProvider
          //customTheme={{ '--ck-font-family': 'monospace' }}
          >
            <App {...appProps} />
          </TestBenchProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

const WagmiTest = () => {
  return <div>wat</div>;
};

export default MyApp;
