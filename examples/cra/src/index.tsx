import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';

import { WagmiConfig, createClient } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';

const client = createClient(
  getDefaultClient({
    appName: 'ConnectKit CRA demo',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ConnectKitProvider
        theme="auto"
        options={{ disclaimer: 'This is a demo disclaimer.' }}
      >
        <App />
      </ConnectKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
