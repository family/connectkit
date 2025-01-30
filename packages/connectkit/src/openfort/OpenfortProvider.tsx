import Openfort, { AuthPlayerResponse, EmbeddedState, RecoveryMethod, ShieldAuthentication, ShieldAuthType } from '@openfort/openfort-js';
import React, { createContext, createElement, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

type RecoveryProps =
  | { method: RecoveryMethod.AUTOMATIC; chainId: number }
  | { method: RecoveryMethod.PASSWORD; password: string; chainId: number };

type ContextValue = {
  signUpGuest: () => Promise<void>;
  handleRecovery: (props: RecoveryProps) => Promise<boolean>;
  embeddedState: EmbeddedState;

  isLoading: boolean;
  needsRecovery: boolean;
  user: AuthPlayerResponse | null;

  logout: () => void;

  // from Openfort
  logInWithEmailPassword: typeof Openfort.prototype.logInWithEmailPassword;
  signUpWithEmailPassword: typeof Openfort.prototype.signUpWithEmailPassword;
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

  const pollEmbeddedState = useCallback(async () => {
    if (!openfort) return;

    try {
      const state = openfort.getEmbeddedState();
      log("Polling embedded state", state);
      setEmbeddedState(state);
    } catch (error) {
      console.error('Error checking embedded state with Openfort:', error);
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
  }, [openfort]);

  const startPollingEmbeddedState = useCallback(() => {
    if (!!pollingRef.current) return;
    log("Starting polling embedded state", pollingRef.current, !!pollingRef.current);
    pollingRef.current = setInterval(pollEmbeddedState, 300);
  }, [pollEmbeddedState]);

  const stopPollingEmbeddedState = useCallback(() => {
    log("Stopping polling embedded state");
    clearInterval(pollingRef.current || undefined);
    pollingRef.current = null;
  }, []);

  useEffect(() => {
    if (!openfort) return;

    startPollingEmbeddedState();

    // return () => {
    //   stopPollingEmbeddedState();
    // };
  }, [openfort]);

  const setUserIfNull = useCallback(async () => {
    if (!openfort) return;
    if (!user) {
      log("Getting user");
      const user = await openfort.getUser();
      log("Setting user", user);
      setUser(user);
    }
  }, [user, openfort]);

  useEffect(() => {
    if (!openfort) return;
    // Poll embedded signer state

    log("Embedded state update", embeddedState);

    switch (embeddedState) {
      case EmbeddedState.NONE:
        break;
      case EmbeddedState.UNAUTHENTICATED:
        setUser(null);
        break;

      case EmbeddedState.CREATING_ACCOUNT: // There is a bug on openfort-js that makes creating account state to be stuck. When its fixed, we should remove this case (same as NONE)
      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        setUserIfNull();

        log("Embedded signer not configured", automaticRecovery);
        // TODO:allow configuration of embedded signer
        // TODO:separate function
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
  }, [embeddedState, openfort, automaticRecovery, /* handleRecovery, */ setUserIfNull]);

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
    const resp = await fetch(`/api/protected-create-encryption-session`, { // TODO:replace with variable
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
    if (!openfort) return false;

    const { method, password, chainId } = { password: undefined, ...props };
    log(`Handling recovery with Openfort: method=${method}, password=${password}, chainId=${chainId}`);
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
      return true;
    } catch (err) {
      log('Error handling recovery with Openfort:', err);
      return false;
    }
  }, [openfort]);

  // ---- Auth functions ----

  const logout = useCallback(() => {
    if (!openfort) return;

    openfort.logout();
    disconnect();
    reset();
    startPollingEmbeddedState();
  }, [openfort]);

  const signUpGuest = useCallback(async () => {
    if (!openfort) return;

    try {
      log('Signing up as guest...');
      const res = await openfort.signUpGuest();
      log('Signed up as guest:', res);
    } catch (error) {
      console.error('Error logging in as guest:', error);
    }
  }, [openfort]);

  const logInWithEmailPassword: typeof Openfort.prototype.logInWithEmailPassword = useCallback(async (props) => {
    return openfort.logInWithEmailPassword(props);
  }, [openfort]);

  const signUpWithEmailPassword: typeof Openfort.prototype.signUpWithEmailPassword = useCallback(async (props) => {
    return openfort.signUpWithEmailPassword(props);
  }, [openfort]);


  // ---- Return values ----

  const isLoading = useCallback(() => {
    switch (embeddedState) {
      case EmbeddedState.NONE:
        return true;

      case EmbeddedState.UNAUTHENTICATED:
        if (user) return true; // If user is set in unauthenticated state, it means that the embedded state is not up to date, so we should wait
        return false;

      case EmbeddedState.CREATING_ACCOUNT: // There is a bug on openfort-js that makes creating account state to be stuck. When its fixed, we should remove this case (same as NONE)
      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        if (!user) return true;
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

  const needsRecovery =
    !automaticRecovery && (
      embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED
      || embeddedState === EmbeddedState.CREATING_ACCOUNT // There is a bug on openfort-js that makes creating account state to be stuck. When its fixed, we should remove this case (same as NONE)
    );

  const value: ContextValue = {
    signUpGuest,
    handleRecovery,
    embeddedState,
    logout,

    isLoading: isLoading(),
    needsRecovery,
    user,

    // from Openfort
    signUpWithEmailPassword,
    logInWithEmailPassword,
  };

  return createElement(Context.Provider, { value }, <>{children}</>);
};

export const useOpenfort = () => {
  const context = React.useContext(Context);
  if (!context)
    throw Error('useOpenfortContext Hook must be inside OpenfortProvider.');
  return context;
};
