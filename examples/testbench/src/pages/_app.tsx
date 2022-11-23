import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiConfig, createClient, chain } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';
import { siwe } from '../siwe';

const client = createClient(
  getDefaultClient({
    //chains: [chain.mainnet, chain.polygon],
    appName: 'ConnectKit testbench',
    appIcon: '/app.png',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
  })
);

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
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>ConnectKit Testbench</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          href="https://fonts.cdnfonts.com/css/pt-root-ui"
          rel="stylesheet"
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
