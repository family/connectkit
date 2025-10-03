import { AccountTypeEnum, AuthPlayerResponse, EmbeddedAccount, EmbeddedState, Openfort, OpenfortError, RecoveryMethod } from '@openfort/openfort-js';
import React, { createElement, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { polygonAmoy } from 'viem/chains';
import { useAccount, useChainId, useDisconnect } from 'wagmi';
import { useOpenfort } from '../components/Openfort/useOpenfort';
import { useConnect } from '../hooks/useConnect';
import { useConnectCallback, useConnectCallbackProps } from '../hooks/useConnectCallback';
import { Context } from './context';
import { createOpenfortClient, setDefaultClient } from './core';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export type ContextValue = {
  signUpGuest: () => Promise<void>;
  embeddedState: EmbeddedState;

  isLoading: boolean;
  needsRecovery: boolean;
  user: AuthPlayerResponse | null;
  updateUser: (user?: AuthPlayerResponse) => Promise<AuthPlayerResponse | null>;

  embeddedAccounts?: EmbeddedAccount[];
  isLoadingAccounts: boolean;

  logout: () => void;

  client: Openfort;
};

const ConnectCallback = ({ onConnect, onDisconnect }: useConnectCallbackProps) => {
  useConnectCallback({
    onConnect,
    onDisconnect,
  });

  return null;
}

export type CoreOpenfortProviderProps = {
  debugMode?: boolean;
} & ConstructorParameters<typeof Openfort>[0] & useConnectCallbackProps;

export const CoreOpenfortProvider: React.FC<PropsWithChildren<CoreOpenfortProviderProps>> = (
  {
    children,
    debugMode,
    onConnect,
    onDisconnect,
    ...openfortProps
  }
) => {
  const log = debugMode ? console.log : () => { };

  const { connectors, connect, reset } = useConnect();
  const { address } = useAccount();
  const [user, setUser] = useState<AuthPlayerResponse | null>(null);

  const { disconnectAsync } = useDisconnect();
  const { walletConfig } = useOpenfort();

  // ---- Openfort instance ----
  const openfort = useMemo(() => {
    log('Creating Openfort instance.', openfortProps);

    if (!openfortProps.baseConfiguration.publishableKey)
      throw Error('CoreOpenfortProvider requires a publishableKey to be set in the baseConfiguration.');


    if (openfortProps.shieldConfiguration && !openfortProps.shieldConfiguration?.passkeyRpId && typeof window !== 'undefined') {
      openfortProps.shieldConfiguration = {
        passkeyRpId: window.location.hostname,
        passkeyRpName: document.title || 'Openfort DApp',
        ...openfortProps.shieldConfiguration,
      };
    }

    const newClient = createOpenfortClient(openfortProps);

    setDefaultClient(newClient);
    return newClient;
  }, []);

  // ---- Embedded state ----
  const [embeddedState, setEmbeddedState] = useState<EmbeddedState>(EmbeddedState.NONE);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const pollEmbeddedState = useCallback(async () => {
    if (!openfort) return;

    try {
      const state = await openfort.embeddedWallet.getEmbeddedState();
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

    return () => {
      stopPollingEmbeddedState();
    };
  }, [openfort]);

  const updateUser = useCallback(async (user?: AuthPlayerResponse, logoutOnError: boolean = false) => {
    if (!openfort) return null;
    log("Updating user", { user, logoutOnError });

    if (user) {
      setUser(user);
      return user;
    }

    try {
      const user = await openfort.user.get()
      log("Getting user");
      setUser(user);
      return user;
    } catch (err: OpenfortError | any) {
      log("Error getting user", err);
      if (!logoutOnError) return null;

      if (err?.response?.status === 404) {
        log("User not found, logging out");
        logout();
      } else if (err?.response?.status === 401) {
        log("User not authenticated, logging out");
        logout();
      }
      return null;
    }
  }, [openfort]);

  const chainId = useChainId();

  useEffect(() => {
    if (!openfort || !walletConfig) return;

    log("Getting ethereum provider", chainId);

    const resolvePolicy = () => {
      const { ethereumProviderPolicyId } = walletConfig;

      if (!ethereumProviderPolicyId) return undefined;

      if (typeof ethereumProviderPolicyId === "string") {
        return { policy: ethereumProviderPolicyId };
      }

      const policy = ethereumProviderPolicyId[chainId];
      if (!policy) {
        log(`No policy found for chainId ${chainId}.`);
        return undefined;
      }

      return { policy };
    };

    openfort.embeddedWallet.getEthereumProvider(resolvePolicy());
  }, [openfort, walletConfig, chainId]);

  const [isConnectedWithEmbeddedSigner, setIsConnectedWithEmbeddedSigner] = useState(false);

  // will reset on logout
  const { data: embeddedAccounts, refetch: fetchEmbeddedAccounts, isPending: isLoadingAccounts } = useQuery({
    queryKey: ['openfortEmbeddedAccountsList'],
    queryFn: () => openfort.embeddedWallet.list({
      limit: 100,
      // If its EOA we want all accounts, otherwise we want only smart accounts
      accountType: walletConfig?.accountType === AccountTypeEnum.EOA ?
        undefined : AccountTypeEnum.SMART_ACCOUNT
    }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!openfort) return;
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
        if (!user)
          updateUser(undefined, true);

        setIsConnectedWithEmbeddedSigner(false);
        fetchEmbeddedAccounts();

        break;
      case EmbeddedState.READY:
        (async () => {
          for (let i = 0; i < 5; i++) {
            log("Trying to update user...", i);
            try {
              const user = await updateUser(undefined, true);
              if (user) break;
            } catch (err) {
              console.error("Error updating user, retrying...", err);
            }
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        })();
        break;
      default:
        throw new Error(`Unknown embedded state: ${embeddedState}`);
    }
  }, [embeddedState, openfort]);

  useEffect(() => {
    // Connect to wagmi with Embedded signer
    if (address || !user) return;
    if (isConnectedWithEmbeddedSigner) return;

    if (embeddedState !== EmbeddedState.READY) return;
    const connector = connectors.find((connector) => connector.name === "Openfort")
    if (!connector) return

    log("Connecting to wagmi with Openfort");
    setIsConnectedWithEmbeddedSigner(true);
    connect({ connector });
  }, [connectors, embeddedState, address, user]);



  // ---- Auth functions ----

  const queryClient = useQueryClient();
  const logout = useCallback(async () => {
    if (!openfort) return;

    setUser(null);
    log('Logging out...');
    await openfort.auth.logout();
    await disconnectAsync();
    queryClient.resetQueries({ queryKey: ['openfortEmbeddedAccountsList'] })
    reset();
    startPollingEmbeddedState();
  }, [openfort]);

  const signUpGuest = useCallback(async () => {
    if (!openfort) return;

    try {
      log('Signing up as guest...');
      const res = await openfort.auth.signUpGuest();
      log('Signed up as guest:', res);
    } catch (error) {
      console.error('Error logging in as guest:', error);
    }
  }, [openfort]);


  // ---- Return values ----

  const isLoading = useCallback(() => {
    switch (embeddedState) {
      case EmbeddedState.NONE:
      case EmbeddedState.CREATING_ACCOUNT:
        return true;

      case EmbeddedState.UNAUTHENTICATED:
        if (user) return true; // If user i<s set in unauthenticated state, it means that the embedded state is not up to date, so we should wait
        return false;

      case EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED:
        if (!user)
          return true;

        // If automatic recovery is enabled, we should wait for the embedded signer to be ready
        return false;
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

  const needsRecovery = (
    embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED
  ) && (
      !address
    );

  const value: ContextValue = {
    signUpGuest,
    embeddedState,
    logout,

    isLoading: isLoading(),
    needsRecovery,
    user,
    updateUser,

    embeddedAccounts,
    isLoadingAccounts,

    client: openfort,
  };

  return createElement(Context.Provider, { value }, <><ConnectCallback onConnect={onConnect} onDisconnect={onDisconnect} />{children}</>);
};
