'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectKitButton, useIsMounted, useOpenfort } from '@openfort/openfort-kit';

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { signUpGuest } = useOpenfort();

  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <div>
        <h2>Account</h2>
        <ConnectKitButton />

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>
      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
      <div>
        <h2>OPENFORT</h2>
        <button
          onClick={() => signUpGuest()}
          type="button"
        >
          guest
        </button>
      </div>
    </>
  );
}

export default App;
