import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { ConnectKitProvider, SIWESession } from 'connectkit';
import { siweClient } from '../utils/siweClient';
import { Web3Provider } from '../components/Web3Provider';
import { useTestBench } from '../TestbenchProvider';

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();
  const key = JSON.stringify({ customTheme }); // re-render on customTheme change

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

      <Web3Provider>
        <App {...appProps} />
      </Web3Provider>
    </>
  );
}

export default MyApp;
