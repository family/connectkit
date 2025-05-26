import { useCallback, useEffect, useState } from "react";
import { useOpenfort } from '../../openfort/useOpenfort';

export function useUser() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { user, getAccessToken, validateAndRefreshToken } = useOpenfort();

  useEffect(() => {
    (async () => {
      setAccessToken(await getAccessToken())
    })();
  }, [user])

  const getAccessTokenAndUpdate = useCallback(async () => {
    const token = await getAccessToken();
    setAccessToken(token);
    return token;
  }, [getAccessToken]);

  return {
    user,
    /** @deprecated Use getAccessToken instead */
    accessToken,
    getAccessToken: getAccessTokenAndUpdate,
    validateAndRefreshToken,
  };
}
