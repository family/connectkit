import type { NextPage } from 'next';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { ConnectKitButton, ChainIcon, useChains } from 'connectkit';

import { useNetwork } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
const allChains = Object.keys(wagmiChains).map(
  (key) => wagmiChains[key as keyof typeof wagmiChains]
);

const Home: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [randomChainId, setRandomChainId] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setRandomChainId(
        allChains[Math.floor(Math.random() * allChains.length)].id
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { chain } = useNetwork();
  const chains = useChains();

  if (!mounted) return null;

  return (
    <>
      <main>
        <div className="panel">
          <h1>Chains</h1>
          <h2>Connected to</h2>
          <ChainIcon id={chain?.id} unsupported={chain?.unsupported} />
          <h2>Configured/Supported Chains</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {chains.map((chain) => (
              <ChainIcon key={chain.id} id={chain.id} />
            ))}
          </div>
          <h2>{`<ChainIcon /> Component`}</h2>
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
            <ChainIcon id={137} size={'32'} />
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
          <div
            style={{
              aspectRatio: '1/1',
              resize: 'horizontal',
              width: 64,
              overflow: 'auto',
            }}
          >
            <ChainIcon id={randomChainId} size={'100%'} />
          </div>
        </div>
        <div className="panel">
          <h2>All Chains</h2>
          <div
            style={{
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
                <ChainIcon id={chain.id} size={42} />
                <span>
                  {chain.name} <code>{chain.id}</code>
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <aside>
        <Link href="/">&larr; Testbench</Link>
        <ConnectKitButton />
      </aside>
    </>
  );
};

export default Home;
