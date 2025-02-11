'use client';

import { ConnectKitButton } from '@openfort/openfort-kit';
import { Info } from './Info';

function App() {
  return (
    <div className="container">
      <ConnectKitButton
        showBalance
      />
      <Info />
    </div>
  );
};

export default App;
