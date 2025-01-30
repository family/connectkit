"use client";
import React, { useEffect, useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FortKitProvider, FortOAuthProvider, getDefaultConfig } from 'connectkit';
import { polygonAmoy } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';
import { RecoveryMethod } from '@openfort/openfort-js';

const config = createConfig(
  getDefaultConfig({
    appName: 'FortKit Next.js demo',
  })
);

const queryClient = new QueryClient();
const chainId = polygonAmoy.id

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FortKitProvider
          baseConfiguration={{
            publishableKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
          }}
          shieldConfiguration={{
            shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,
          }}
          recoveryMethod={RecoveryMethod.PASSWORD}

          options={
            {
              authProviders: [
                FortOAuthProvider.EMAIL,
                FortOAuthProvider.GOOGLE,
                FortOAuthProvider.GUEST,
                FortOAuthProvider.WALLET,
              ],
            }
          }
          chainId={chainId}
          debugMode
          // theme='rounded'
          mode='dark'
          theme='retro'
        // theme='nouns'

        >
          {children}
        </FortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
