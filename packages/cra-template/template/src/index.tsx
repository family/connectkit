import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { WagmiProvider, createConfig } from 'wagmi';
import { OpenfortKitProvider, getDefaultConfig } from '@openfort/openfort-kit';
import { RecoveryMethod } from '@openfort/openfort-js';

const config = createConfig(
  getDefaultConfig({
    appName: 'My App Name',
    walletConnectProjectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID!,
  })
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <OpenfortKitProvider
        theme="auto"
        publishableKey={process.env.REACT_APP_OPENFORT_PUBLIC_KEY!}
        walletConfig={{
          createEmbeddedSigner: true,
          embeddedSignerConfiguration: {
            shieldPublishableKey: process.env.REACT_APP_SHIELD_API_KEY!,
            recoveryMethod: RecoveryMethod.PASSWORD,
            shieldEncryptionKey: process.env.REACT_APP_SHIELD_ENCRYPTION_KEY!,
          },
        }}
      >
        <App />
      </OpenfortKitProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
