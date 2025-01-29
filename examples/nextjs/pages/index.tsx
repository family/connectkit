import { ConnectKitButton } from 'connectkit';
import type { NextPage } from 'next';
import { Connected } from './Connected';

const Home: NextPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'start',
        height: '100vh',
        flexDirection: 'column',
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px',
      }}>
        <ConnectKitButton />
        <Connected />
      </div>
    </div>
  );
};

export default Home;
