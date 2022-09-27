import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import { WagmiConfig, createClient, chain } from 'wagmi';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit Vite demo',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto">
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
