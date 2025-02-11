'use client';

import { OpenfortKitButton } from '@openfort/openfort-kit';
import { Info } from './Info';

function App() {
  return (
    <div className="container">
      <OpenfortKitButton
        showBalance
      />
      <Info />
    </div>
  );
};

export default App;
