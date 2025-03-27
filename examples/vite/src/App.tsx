import { OpenfortKitButton, useModal, useUser } from '@openfort/openfort-kit';
import { useEffect } from 'react';
import './App.css';

function App() {
  const { setOpen } = useModal();
  const { user } = useUser();

  useEffect(() => {
    setOpen(!user)
  }, [user])

  return (
    <OpenfortKitButton />
  )
}

export default App
