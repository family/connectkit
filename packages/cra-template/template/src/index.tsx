import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { WagmiProvider, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'My App Name',
    //infuraId: process.env.REACT_APP_INFURA_ID,
    //alchemyId:  process.env.REACT_APP_ALCHEMY_ID,
    chains: [mainnet, polygon],
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID!,
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <ConnectKitProvider theme="auto">
        <App />
      </ConnectKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
