import type { NextPage } from 'next';
import { ConnectKitButton, ConnectKitModalDemo } from 'connectkit';
import { useContext } from 'connectkit/build/components/ConnectKit';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <ConnectKitButton />
      {address && (
        <>
          <p>Connected with address: {address}</p>
          <button style={{ margin: "10px" }}>Mint... with wagmi</button>
          <button style={{ margin: "10px" }}>Sign... with wagmi</button>
        </>
      )}
    </div>
  );
};

export default Home;
