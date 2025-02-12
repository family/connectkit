"use client";
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { Web3Provider } from '../components/Web3Provider';
import { SampleContext, SampleProvider } from '../components/SampleProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SampleProvider>
      <Web3Provider>
        <Component {...pageProps} />
      </Web3Provider>
    </SampleProvider>
  );
}

export default MyApp;
