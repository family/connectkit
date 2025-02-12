"use client";
import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, OpenfortKitProvider, RecoveryMethod, getDefaultConfig } from '@openfort/openfort-kit';
import { beamTestnet, polygonAmoy } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';
import CustomLogo from './CustomLogo';
import { useSample } from './SampleProvider';
import { Theme } from '@openfort/openfort-kit/build/types';

const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit Next.js demo',
    chains: [beamTestnet, polygonAmoy],

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    ssr: true,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { sampleTheme } = useSample();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider

          // Set the publishable key of your OpenfortKit account. This field is required.
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            createEmbeddedSigner: true,

            embeddedSignerConfiguration: {
              shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,

              // Set the recovery method you want to use, in this case we will use the password recovery method
              recoveryMethod: RecoveryMethod.PASSWORD,

              // Your can customize the recovery method, either by setting the recovery method function or the endpoint
              getEncryptionSession: async () => {
                const res = await fetch('/api/protected-create-encryption-session', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                return (await res.json()).session;
              },
              // This is how you would customize only the endpoint:
              // createEncryptedSessionEndpoint: '/api/protected-create-encrypted-session',


              // You can set a policy id to sponsor the gas fees for your users
              ethereumProviderPolicyId: process.env.NEXT_PUBLIC_POLICY_ID,
            }
          }}

          // This is the callback that will be called when the user connects or disconnects
          onConnect={(params) => {
            console.log('onConnect', params);
          }}
          onDisconnect={() => {
            console.log('onDisconnect');
          }}

          options={{
            // You can customize the logo of your app
            logo: (<CustomLogo />),

            // Set the auth providers you want to use
            authProviders: [
              AuthProvider.GUEST,
              AuthProvider.EMAIL,
              AuthProvider.GOOGLE,
              AuthProvider.TWITTER,
              AuthProvider.FACEBOOK,
              AuthProvider.WALLET,
            ],

            // Set the chain id you want to use, by default it will use the first chain
            initialChainId: polygonAmoy.id,

            // Skip the email verification, useful for testing
            skipEmailVerification: true,

            // Other useful options
            overlayBlur: 2.5,
            hideTooltips: true,
          }}

          // debugMode

          // Set the theme of the OpenfortKit
          theme={sampleTheme}
        >
          {children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
