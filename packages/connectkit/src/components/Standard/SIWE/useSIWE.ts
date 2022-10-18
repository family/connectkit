import { useContext } from 'react';
import { SIWEContext } from './SIWEContext';

// Consumer-facing hook

export const useSIWE = () => {
  const siweContextValue = useContext(SIWEContext);
  if (!siweContextValue) {
    throw new Error('useSIWE hook must be inside a SIWEProvider.');
  }

  const { session, nonce, signOutAndRefetch: signOut } = siweContextValue;
  const { address, chainId } = session.data || {};

  return {
    address,
    chainId,
    signedIn: !!address,
    signOut,
    session,
    nonce,
  };
};
