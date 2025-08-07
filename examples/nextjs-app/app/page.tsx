'use client';

import { OpenfortKitButton, useUI, useStatus } from '@openfort/openfort-kit';
import { useEffect, useState } from 'react';
import { Info } from './Info';

function App() {

  const { open } = useUI();
  const { isLoading, isConnected } = useStatus();
  const [shouldOpenIfDisconnected, setSetShouldOpenIfDisconnected] = useState(true);

  useEffect(() => {
    if (!shouldOpenIfDisconnected) return;
    if (isLoading) return;

    if (!isConnected) {
      open();
    }

    setSetShouldOpenIfDisconnected(false);
  }, [isLoading, isConnected, shouldOpenIfDisconnected, open]);

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
