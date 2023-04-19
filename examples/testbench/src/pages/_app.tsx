import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiConfig, createClient } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import {
  ConnectKitProvider,
  defaultWallets,
  getDefaultClient,
  SIWESession,
} from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siweClient } from '../utils/siweClient';
import { useEffect } from 'react';
import { familyStaging } from '../family';

const client = createClient(
  getDefaultClient({
    //chains: [mainnet, polygon],
    appName: 'ConnectKit testbench',
    appIcon: '/app.png',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    //walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);
const getWallets = (type: string) => {
  switch (type) {
    case 'default':
      return [...defaultWallets];
    case 'only fams':
      return [...defaultWallets].filter((wallet) => wallet.id === 'family');
    case 'default + family staging':
      return [familyStaging, ...defaultWallets];
    case 'noWalletConnect':
      return [...defaultWallets].filter(
        (wallet) => wallet.id !== 'walletConnect'
      );
  }
};

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme, wallets } = useTestBench();

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
        wallets={getWallets(wallets)}
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
      <WagmiConfig client={client}>
        <TestBenchProvider
        //customTheme={{ '--ck-font-family': 'monospace' }}
        >
          <App {...appProps} />
        </TestBenchProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
