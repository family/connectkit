import { useCallback, useState } from 'react';
import { useOpenfort } from '../../../openfort/useOpenfort';
import { BaseFlowState, mapStatus } from './status';
import { useDisconnect } from 'wagmi';
import { OpenfortHookOptions, OpenfortKitError, OpenfortKitErrorType } from '../../../types';
import { onSuccess } from '../hookConsistency';

export function useSignOut(hookOptions: OpenfortHookOptions = {}) {
  const { client, updateUser, user } = useOpenfort();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });
  const { disconnect } = useDisconnect();


  const signOut = useCallback(async (options: OpenfortHookOptions = {}) => {
    if (!user)
      return;

    setStatus({
      status: 'loading',
    });
    try {
      await client.auth.logout();
      disconnect();
      updateUser();
      setStatus({
        status: 'success',
      });

      return onSuccess({
        hookOptions,
        options,
        data: {},
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to sign out');

      setStatus({
        status: 'error',
        error: new OpenfortKitError('Failed to sign out', OpenfortKitErrorType.AUTHENTICATION_ERROR, { error }),
      });
      throw error;
    }
  }, [client, user, disconnect, updateUser, setStatus, hookOptions]);

  return {
    ...mapStatus(status),
    signOut,
  };
}