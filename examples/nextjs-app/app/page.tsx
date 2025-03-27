'use client';

import { OpenfortKitButton, useModal, useStatus } from '@openfort/openfort-kit';
import { useEffect, useState } from 'react';
import { Info } from './Info';

function App() {

  const { setOpen } = useModal();
  const { isLoading, isConnected } = useStatus();
  const [shouldOpenIfDisconnected, setSetShouldOpenIfDisconnected] = useState(true);

  useEffect(() => {
    if (!shouldOpenIfDisconnected) return;
    if (isLoading) return;

    if (!isConnected) {
      setOpen(true);
    }

    setSetShouldOpenIfDisconnected(false);
  }, [isLoading, isConnected, shouldOpenIfDisconnected, setOpen]);

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
