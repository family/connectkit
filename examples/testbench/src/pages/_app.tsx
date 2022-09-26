import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { WagmiConfig, createClient } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { TestBenchProvider, useTestBench } from '../TestbenchProvider';

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit testbench',
    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
  })
);

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options } = useTestBench();

  return (
    <ConnectKitProvider theme={theme} mode={mode} options={options}>
      <Component {...pageProps} />
    </ConnectKitProvider>
  );
}
function MyApp(appProps: AppProps) {
  return (
    <>
      <Head>
        <title>ConnectKit Testbench</title>
      </Head>
      <WagmiConfig client={client}>
        <TestBenchProvider>
          <App {...appProps} />
        </TestBenchProvider>
      </WagmiConfig>
    </>
  );
}

export default MyApp;
