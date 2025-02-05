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
        alignItems: 'center',
        gap: '20px',
        marginTop: '20px',
      }}>
        <ConnectKitButton
          showBalance
        />
        <Connected />
      </div>
    </div>
  );
};

export default Home;
