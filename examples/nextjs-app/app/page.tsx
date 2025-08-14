'use client';

import { OpenfortButton, useUI, useStatus } from '../../../packages/react/build';
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
      <OpenfortButton
        showBalance
      />
      <Info />
    </div>
  );
};

export default App;
