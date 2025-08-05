import { useCallback, useEffect, useState } from "react";
import { useOpenfort } from '../../openfort/useOpenfort';

export function useUser() {
  const { user, client } = useOpenfort();


  const getAccessTokenAndUpdate = useCallback(async () => {
    await client.validateAndRefreshToken();
    const token = await client.getAccessToken();
    return token;
  }, [client]);

  return {
    user,
    getAccessToken: getAccessTokenAndUpdate,
    validateAndRefreshToken: async () => await client.validateAndRefreshToken(),
  };
}
