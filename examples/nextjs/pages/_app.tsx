"use client";
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { SampleProvider } from '../components/SampleProvider';
import { Web3Provider } from '../components/Web3Provider';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Openfort Kit Sample</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <SampleProvider>
        <Web3Provider>
          <Component {...pageProps} />
        </Web3Provider>
      </SampleProvider>
    </>
  );
}

export default MyApp;
