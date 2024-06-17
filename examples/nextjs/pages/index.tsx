'use client';

import type { NextPage } from 'next';
import { useIsMounted } from 'connectkit';
import { useConnectors } from 'wagmi';

const Home: NextPage = () => {
  const connectors = useConnectors();

  const mounted = useIsMounted();
  if (!mounted) return;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => connector.connect()}>
          {connector.name}
        </button>
      ))}
    </div>
  );
};

export default Home;
