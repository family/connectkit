"use client";
import type { AppProps } from 'next/app';
import '../styles/globals.css';

import { SampleProvider } from '../components/SampleProvider';
import { Web3Provider } from '../components/Web3Provider';

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
