import { useCallback, useEffect, useState } from "react";
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { useStatus } from "./useStatus";

export function useUser() {
  const { user, client } = useOpenfortCore();
  const { isAuthenticated } = useStatus();

  const getAccessTokenAndUpdate = useCallback(async () => {
    await client.validateAndRefreshToken();
    const token = await client.getAccessToken();
    return token;
  }, [client]);

  return {
    user,
    isAuthenticated,
    getAccessToken: getAccessTokenAndUpdate,
    validateAndRefreshToken: async () => await client.validateAndRefreshToken(),
  };
};
