import { useState, useCallback, useEffect, useRef } from 'react';
import { EmbeddedState, Provider } from '@openfort/openfort-js';
import OpenfortService from '../../openfort/services/openfortService';

// remove this
const openfortService = new OpenfortService(1);

export const useOpenfort = () => {
  const [error, setError] = useState<Error | null>(null);
  const [embeddedState, setEmbeddedState] = useState<EmbeddedState>(EmbeddedState.NONE);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pollEmbeddedState = async () => {
      try {
        const state = await openfortService.getEmbeddedState();
        setEmbeddedState(state);
      } catch (error) {
        console.error('Error checking embedded state with Openfort:', error);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    };

    if (!pollingRef.current) {
      pollingRef.current = setInterval(pollEmbeddedState, 300);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = null;
    };
  }, []);

  const authenticateWithOpenfort = useCallback(async (identityToken: string) => {
    try {
      await openfortService.authenticateWithThirdPartyProvider(identityToken);
    } catch (error) {
      console.error('Error authenticating with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during Openfort authentication'));
    }
  }, []);

  const getEvmProvider = useCallback((): Provider => {
    const externalProvider = openfortService.getEvmProvider();
    if (!externalProvider) {
      throw new Error('EVM provider is undefined');
    }
    return externalProvider
  }, []);


  const handleRecovery = useCallback(async (method: "password" | "automatic", identityToken: string, pin?: string) => {
    try {
      if (method === "automatic") {
        await openfortService.setAutomaticRecoveryMethod(identityToken)
      } else if (method === "password") {
        if (!pin || pin.length < 4) {
          alert("Password recovery must be at least 4 characters");
          return;
        }
        await openfortService.setPasswordRecoveryMethod(identityToken, pin);
      }
    } catch (error) {
      console.error('Error handling recovery with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during recovery handling'));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await openfortService.logout();
    } catch (error) {
      console.error('Error logging out with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during logout'));
    }
  }, []);


  return {
    authenticateWithOpenfort,
    embeddedState,
    getEvmProvider,
    handleRecovery,
    error,
    logout
  }
};
