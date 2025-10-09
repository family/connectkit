import { useCallback } from "react";
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { EmbeddedState } from "@openfort/openfort-js";
import { handleOAuthConfigError } from '../../utils/oauthErrorHandler';

/**
 * Hook for accessing current user information and authentication state
 *
 * This hook provides access to the current authenticated user's information and
 * authentication status. It also offers methods to manage access tokens and validate
 * user sessions. The hook automatically updates when authentication state changes.
 *
 * @returns Current user state and authentication utilities
 *
 * @example
 * ```tsx
 * const userHook = useUser();
 *
 * // Check if user is authenticated
 * if (userHook.isAuthenticated && userHook.user) {
 *   console.log('User is authenticated:', userHook.user);
 *   console.log('User ID:', userHook.user.id);
 *   console.log('User email:', userHook.user.email);
 *   console.log('Linked accounts:', userHook.user.linkedAccounts);
 * } else {
 *   console.log('User is not authenticated');
 * }
 *
 * // Get fresh access token
 * const getToken = async () => {
 *   try {
 *     const token = await userHook.getAccessToken();
 *     console.log('Access token:', token);
 *   } catch (error) {
 *     console.error('Failed to get access token:', error);
 *   }
 * };
 *
 * // Validate and refresh token if needed
 * const refreshToken = async () => {
 *   try {
 *     await userHook.validateAndRefreshToken();
 *     console.log('Token validated and refreshed');
 *   } catch (error) {
 *     console.error('Token validation failed:', error);
 *   }
 * };
 * ```
 */
export function useUser() {
  const { user, client, embeddedState } = useOpenfortCore();

  const getAccessTokenAndUpdate = useCallback(async () => {
    try {
      await client.validateAndRefreshToken();
      const token = await client.getAccessToken();
      return token;
    } catch (error: any) {
      handleOAuthConfigError(error);
      throw error;
    }
  }, [client]);

  const validateAndRefresh = useCallback(async () => {
    try {
      await client.validateAndRefreshToken();
    } catch (error: any) {
      handleOAuthConfigError(error);
      throw error;
    }
  }, [client]);

  return {
    user,
    isAuthenticated: embeddedState !== EmbeddedState.NONE && embeddedState !== EmbeddedState.UNAUTHENTICATED,
    getAccessToken: getAccessTokenAndUpdate,
    validateAndRefreshToken: validateAndRefresh,
  };
};
