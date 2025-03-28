import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { OpenfortKitProvider } from '@openfort/openfort-kit';
import { Web3Provider } from '../components/Web3Provider';
import { useTestBench } from '../TestbenchProvider';

function App({ Component, pageProps }: AppProps) {
  const { theme, mode, options, customTheme } = useTestBench();
  const key = JSON.stringify({ customTheme }); // re-render on customTheme change

  return (
    <OpenfortKitProvider

      publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}
      walletConfig={{
        linkWalletOnSignUp: true,
      }}

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
    </OpenfortKitProvider>
  );
}
function MyApp(appProps: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>OpenfortKit Testbench</title>
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
