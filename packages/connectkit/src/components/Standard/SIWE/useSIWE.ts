import { useContext } from 'react';
import { SIWEContext } from './SIWEContext';

// Consumer-facing hook

export const useSIWE = () => {
  const siweContextValue = useContext(SIWEContext);
  if (!siweContextValue) {
    // If we throw an error here then this will break non-SIWE apps, so best to just respond with not signed in.
    //throw new Error('useSIWE hook must be inside a SIWEProvider.');
    return {
      signedIn: false,
    };
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
