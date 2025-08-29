import { useCallback, useState } from 'react';
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { BaseFlowState, mapStatus } from './status';
import { useDisconnect } from 'wagmi';
import { OpenfortHookOptions, OpenfortError, OpenfortErrorType } from '../../../types';
import { onError, onSuccess } from '../hookConsistency';
import { useQueryClient } from '@tanstack/react-query';

export function useSignOut(hookOptions: OpenfortHookOptions = {}) {
  const { client, updateUser, user } = useOpenfortCore();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });
  const { disconnect } = useDisconnect();

  const queryClient = useQueryClient();

  const signOut = useCallback(async (options: OpenfortHookOptions = {}) => {
    setStatus({
      status: 'loading',
    });
    try {

      await client.auth.logout();
      queryClient.resetQueries({ queryKey: ['openfortEmbeddedWalletList'] })
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