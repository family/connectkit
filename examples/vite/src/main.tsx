import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Vite demo',
    //infuraId: import.meta.env.VITE_INFURA_ID,
    //alchemyId:  import.meta.env.VITE_ALCHEMY_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider debugMode>
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
