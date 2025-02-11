import { ConnectKitButton } from '@openfort/openfort-kit';
import type { NextPage } from 'next';
import { Info } from '../components/Info';

const Home: NextPage = () => {
  return (
    <div className="container">
      <ConnectKitButton
        showBalance
      />
      <Info />
    </div>
  );
};

export default Home;
