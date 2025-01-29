import Openfort, { AuthPlayerResponse, EmbeddedState, RecoveryMethod, ShieldAuthentication, ShieldAuthType } from '@openfort/openfort-js';
import React, { createContext, createElement, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

type RecoveryProps =
  | { method: RecoveryMethod.AUTOMATIC; chainId: number }
  | { method: RecoveryMethod.PASSWORD; password: string; chainId: number };

type ContextValue = {
  signUpGuest: () => Promise<void>;
  handleRecovery: (props: RecoveryProps) => Promise<void>;
  embeddedState: EmbeddedState;

  isLoading: boolean;
  needsRecovery: boolean;
  user: AuthPlayerResponse | null;

  logout: () => void;

  // from Openfort
  getEthereumProvider: typeof Openfort.prototype.getEthereumProvider;
};

const Context = createContext<ContextValue | null>(null);

export type OpenfortProviderProps = {
  debugMode?: boolean;
  recoveryMethod?: RecoveryMethod;
  // chainId: number;
} & ConstructorParameters<typeof Openfort>[0];


export const OpenfortProvider: React.FC<PropsWithChildren<OpenfortProviderProps>> = (
  {
    children,
    // chainId,
    recoveryMethod: recoveryMethodUsed = RecoveryMethod.AUTOMATIC,
    debugMode,
    ...openfortProps
  }
) => {
  const log = debugMode ? console.log : () => { };

  const { connectors, connect, reset } = useConnect();
  const { address } = useAccount();
  const [user, setUser] = useState<AuthPlayerResponse | null>(null);

  const { disconnect } = useDisconnect();
  const automaticRecovery = recoveryMethodUsed === RecoveryMethod.AUTOMATIC;

  // ---- Openfort instance ----
  const openfort = useMemo(() => {
    log('Creating Openfort instance with props:', openfortProps);

    if (!openfortProps.baseConfiguration.publishableKey)
      throw Error('OpenfortProvider requires a publishableKey to be set in the baseConfiguration.');

    return new Openfort(openfortProps)
  }, []);

  // ---- Embedded state ----
  const [embeddedState, setEmbeddedState] = useState<EmbeddedState>(EmbeddedState.NONE);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingEmbeddedState = !!pollingRef.current;

  const pollEmbeddedState = useCallback(() => {
    try {
      const state = openfort.getEmbeddedState();
      log("Polling embedded state", state);
      setEmbeddedState(state);
    } catch (error) {
      console.error('Error checking embedded state with Openfort:', error);
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, []);

  const startPollingEmbeddedState = useCallback(() => {
    if (isPollingEmbeddedState) return;
    log("Starting polling embedded state");
    pollingRef.current = setInterval(pollEmbeddedState, 300);
  }, [isPollingEmbeddedState]);

  const stopPollingEmbeddedState = useCallback(() => {
    log("Stopping polling embedded state");
    clearInterval(pollingRef.current || undefined);
    pollingRef.current = null;
  }, [isPollingEmbeddedState]);

  useEffect(() => {
    if (!openfort) return;

    startPollingEmbeddedState();

    return () => {
      stopPollingEmbeddedState();
    };
  }, [openfort]);

  const setUserIfNull = useCallback(async () => {
    if (!user) {
      const user = await openfort.getUser();
      log("Setting user", user);
      setUser(user);
    }
  }, [user]);

  useEffect(() => {
    // Poll embedded signer state

    log("Embedded state update", embeddedState);

    switch (embeddedState) {
      case EmbeddedState.NONE:
      case EmbeddedState.CREATING_ACCOUNT:
        break;
      case EmbeddedState.UNAUTHENTICATED:
        setUser(null);
        break;

      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        setUserIfNull();

        log("Embedded signer not configured", automaticRecovery);
        // new-todo:allow configuration of embedded signer
        // new-todo:separate function
        if (automaticRecovery) {
          log("Automatic recovery enabled, configuring embedded signer");
          handleRecovery({
            method: RecoveryMethod.AUTOMATIC,
            chainId: 80002
          });
        }
        break;
      case EmbeddedState.READY:
        log("Getting ethereum provider");
        openfort.getEthereumProvider();

        setUserIfNull();

        stopPollingEmbeddedState();

        break;

      default:
        throw new Error(`Unknown embedded state: ${embeddedState}`);
    }
  }, [embeddedState])

  useEffect(() => {
    // Connect to wagmi with Openfort

    if (embeddedState !== EmbeddedState.READY) return;
    const connector = connectors.find((connector) => connector.name === "Openfort")
    if (!connector) return

    log("Connecting to wagmi with Openfort");
    connect({ connector: connector!, chainId: 80002 });
  }, [connectors, embeddedState])


  // ---- Recovery ----
  const getEncryptionSession = async (): Promise<string> => {
    const resp = await fetch(`/api/protected-create-encryption-session`, { // new-todo:replace with variable
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error("Failed to create encryption session");
    }

    const respJSON = await resp.json();
    return respJSON.session;
  }

  const handleRecovery = useCallback(async (props: RecoveryProps) => {
    const { method, password, chainId } = { password: undefined, ...props };
    try {
      const shieldAuth: ShieldAuthentication = {
        auth: ShieldAuthType.OPENFORT,
        token: openfort.getAccessToken()!,
        encryptionSession: await getEncryptionSession(),
      };
      if (method === 'automatic') {
        await openfort.configureEmbeddedSigner(chainId, shieldAuth);
      } else if (method === 'password') {
        if (!password || password.length < 4) {
          throw new Error('Password recovery must be at least 4 characters');
        }
        await openfort.configureEmbeddedSigner(chainId, shieldAuth, password);
      }
    } catch (err) {
      console.error('Error handling recovery with Openfort:', err);
      alert(`Error: ${(err as unknown as Error).message}`);
      location.reload();
    }
  }, []);

  const logout = useCallback(() => {
    openfort.logout();
    disconnect();
    reset();
    startPollingEmbeddedState();
  }, []);

  const signUpGuest = useCallback(async () => {
    try {
      log('Signing up as guest...');
      const res = await openfort.signUpGuest();
      log('Signed up as guest:', res);
    } catch (error) {
      console.error('Error logging in as guest:', error);
    }
  }, [openfort]);

  const isLoading = useCallback(() => {
    switch (embeddedState) {
      case EmbeddedState.NONE:
      case EmbeddedState.CREATING_ACCOUNT:
        return true;

      case EmbeddedState.UNAUTHENTICATED:
        return false;
      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        // If automatic recovery is enabled, we should wait for the embedded signer to be ready
        if (automaticRecovery) {
          return true;
        } else {
          return false;
        }
      case EmbeddedState.READY:
        // We should wait for the user to be set  
        if (!address || !user)
          return true;
        else
          return false;

      default:
        return true;
    }
  }, [embeddedState, address, user]);

  const value: ContextValue = {
    signUpGuest,
    handleRecovery,
    embeddedState,
    logout,

    isLoading: isLoading(),
    needsRecovery: !automaticRecovery && embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED,
    user,

    // from Openfort
    getEthereumProvider: () => openfort.getEthereumProvider(),
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useOpenfort = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('useOpenfortContext Hook must be inside OpenfortProvider.');
  return context;
};
