import type { NextPage } from 'next';
import { ConnectKitButton, ChainIcon, useChains } from 'connectkit';
import { useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';

import * as wagmiChains from 'wagmi/chains';
const allChains = Object.keys(wagmiChains).map(
  (key) => wagmiChains[key as keyof typeof wagmiChains]
);

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { chain } = useNetwork();
  const chains = useChains();

  if (!mounted) return null;

  return (
    <>
      <main>
        <h1>Chains</h1>
        <h2>Connected to</h2>
        <ChainIcon id={chain?.id} unsupported={chain?.unsupported} />
        <h2>Supported Chains</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {chains.map((chain) => (
            <ChainIcon key={chain.id} id={chain.id} />
          ))}
        </div>
        <h2>ChainIcon</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChainIcon id={10} size={16} />
          <ChainIcon id={10} size={16} unsupported />
          <ChainIcon id={10} radius={8} size={16} unsupported />
          <ChainIcon id={10} radius={'0'} size={16} unsupported />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChainIcon id={42161} />
          <ChainIcon id={42161} unsupported />
          <ChainIcon id={42161} radius={8} unsupported />
          <ChainIcon id={42161} radius={'0'} unsupported />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChainIcon id={137} size={32} />
          <ChainIcon id={137} size={32} unsupported />
          <ChainIcon id={137} radius={8} size={32} unsupported />
          <ChainIcon id={137} radius={'0'} size={32} unsupported />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ChainIcon id={43113} size={64} />
          <ChainIcon id={43113} size={64} unsupported />
          <ChainIcon id={43113} radius={8} size={64} unsupported />
          <ChainIcon id={43113} radius={'0'} size={64} unsupported />
        </div>
        <h2>All Chains</h2>
        <div
          style={{
            boxShadow: '0 0 0 1px #eee',
            padding: 8,
            borderRadius: 8,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 8,
          }}
        >
          {allChains.map((chain) => (
            <div
              key={chain.id}
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
            >
              <ChainIcon id={chain.id} />
              <span>
                {chain.name} <code>{chain.id}</code>
              </span>
            </div>
          ))}
        </div>
      </main>
      <aside>
        <ConnectKitButton />
      </aside>
    </>
  );
};

export default Home;
