import { OpenfortKitButton } from '@openfort/openfort-kit';
import type { NextPage } from 'next';
import { Info } from '../components/Info';

const Home: NextPage = () => {
  return (
    <div className="container">
      <OpenfortKitButton
        showBalance
      />
      <Info />
    </div>
  );
};

export default Home;
