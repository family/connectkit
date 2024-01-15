import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiProvider, createConfig, useAccount, useConnect } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig, SIWESession } from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siweClient } from '../utils/siweClient';
import { useEffect } from 'react';

import { http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

/*
const config = createConfig(
  getDefaultConfig({
    //chains: [mainnet, polygon],
    appName: 'ConnectKit testbench',
    appIcon: '/app.png',
    infuraApiKey: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);
*/

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();

  const key = JSON.stringify({ customTheme });

  // SIWE provider needs to be the outer-most provider because the connect kit
  // provider depends on some of the state

  useEffect(() => {
    console.log('App rendered');
  }, [customTheme]);

  return (
    /*
    <siweClient.Provider
      onSignIn={(data?: SIWESession) => {
        console.log('onSignIn Provider', data);
      }}
      onSignOut={() => {
        console.log('onSignOut Provider');
      }}
    >
    */
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
    /*
    </siweClient.Provider>
    */
  );
}

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
function MyApp(appProps: AppProps) {
  return (
    <>
      <WagmiProvider config={config}>
        <WagmiTest />
      </WagmiProvider>
    </>
  );
}

const WagmiTest = () => {
  useConnect();
  return (
    <div>
      <pre>wat</pre>
    </div>
  );
};

export default MyApp;
