import { useCallback, useState } from 'react';
import { useOpenfortCore } from '../../../openfort/useOpenfort';
import { OpenfortError, OpenfortErrorType, OpenfortHookOptions } from '../../../types';
import { onError, onSuccess } from '../hookConsistency';
import { BaseFlowState, mapStatus } from './status';

export function useSignOut(hookOptions: OpenfortHookOptions = {}) {
  const { logout } = useOpenfortCore();
  const [status, setStatus] = useState<BaseFlowState>({
    status: "idle",
  });

  const signOut = useCallback(async (options: OpenfortHookOptions = {}) => {
    setStatus({
      status: 'loading',
    });
    try {

      logout();
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
  }, [logout, setStatus, hookOptions]);

  return {
    ...mapStatus(status),
    signOut,
  };
}