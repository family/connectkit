import { useContext } from 'react';
import { SIWEContext, StatusState } from './SIWEContext';

type Props = {
  isSignedIn: boolean;
  data?: {
    address: string;
    chainId: number;
  };
  status: StatusState;
  error?: Error | any;
  isRejected: boolean;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isReady: boolean;

  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  reset: () => void;
};

// Consumer-facing hook
export const useSIWE = (): Props => {
  const siweContextValue = useContext(SIWEContext);
  if (!siweContextValue) {
    // If we throw an error here then this will break non-SIWE apps, so best to just respond with not signed in.
    //throw new Error('useSIWE hook must be inside a SIWEProvider.');
    return {
      isSignedIn: false,
      data: undefined,
      status: StatusState.ERROR,
      error: new Error('useSIWE hook must be inside a SIWEProvider.'),
      isRejected: false,
      isError: true,
      isLoading: false,
      isSuccess: false,
      isReady: false,
      signIn: () => Promise.reject(),
      signOut: () => Promise.reject(),
      reset: () => {},
    };
  }

  const {
    session,
    nonce,
    signOutAndRefetch: signOut,
    signIn,
    status,
    resetStatus,
  } = siweContextValue;
  const { address, chainId } = session.data || {};

  const currentStatus = address
    ? StatusState.SUCCESS
    : session.isLoading || nonce.isLoading
    ? StatusState.LOADING
    : status;

  const isLoading = currentStatus === StatusState.LOADING;
  const isSuccess = currentStatus === StatusState.SUCCESS;
  const isRejected = currentStatus === StatusState.REJECTED;
  const isError = currentStatus === StatusState.ERROR;
  const isReady = !address || nonce.isFetching || isLoading || isSuccess;

  const reset = () => resetStatus();

  return {
    isSignedIn: !!address,
    data: !!address
      ? {
          address: address as string,
          chainId: chainId as number,
        }
      : undefined,
    status: currentStatus,
    error: session.error || nonce.error,
    isRejected,
    isError,
    isLoading,
    isSuccess,
    isReady,
    signIn,
    signOut,
    reset,
  };
};
