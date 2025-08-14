import { useCallback, useState } from 'react';
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { BaseFlowState, mapStatus } from './status';
import { useDisconnect } from 'wagmi';
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from '../../../types';
import { onError, onSuccess } from '../hookConsistency';

export function useSignOut(hookOptions: OpenfortHookOptions = {}) {
  const { client, updateUser, user } = useOpenfortCore();
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
    } catch (e) {
      const error = new OpenfortError('Failed to sign out', OpenfortErrorType.AUTHENTICATION_ERROR, { error: e })
      setStatus({
        status: 'error',
        error,
      });
      return onError({
        hookOptions,
        options,
        error,
      });
    }
  }, [client, user, disconnect, updateUser, setStatus, hookOptions]);

  return {
    ...mapStatus(status),
    signOut,
  };
}