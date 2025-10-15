/**
 * Utility to handle and provide better error messages for OAuth configuration errors
 */

export function handleOAuthConfigError(error: any): void {
  if (error?.message?.includes('OAuth Config with provider') && error?.message?.includes('not found')) {
    const providerMatch = error.message.match(/provider\s+(\w+)\s+not found/i);
    const provider = providerMatch ? providerMatch[1] : 'unknown';
    const providerLower = provider.toLowerCase();

    // Provider-specific configuration hints
    const configHints: Record<string, string> = {
      supabase: '- Supabase url: Your Supabase project URL (e.g., https://xxxxx.supabase.co)\n   - Supabase key: Your Supabase anon/public key',
      firebase: '- Firebase configuration details',
      custom: '- Provider-specific configuration fields',
    };

    const hint = configHints[providerLower] || configHints.custom;

    console.error(
      `❌ Openfort OAuth Configuration Error:\n\n` +
      `The OAuth provider "${provider}" is not configured in your Openfort account.\n\n` +
      `To fix this:\n` +
      `1. Go to https://dashboard.openfort.io\n` +
      `2. Navigate to Configuration → Providers\n` +
      `3. Enable "${provider}" in the Third Party Authentication section\n` +
      `4. Configure the required fields:\n` +
      `   ${hint}\n` +
      `5. Click "Save"\n` +
      `6. Ensure your thirdPartyAuth prop includes:\n` +
      `   - provider: ThirdPartyOAuthProvider.${provider.toUpperCase()}\n` +
      `   - getAccessToken: async function that returns the ${provider} access token\n\n` +
      `See: https://www.openfort.io/docs/guides/auth/third-party-authentication`
    );
  }
}

export function isOAuthConfigError(error: any): boolean {
  return error?.message?.includes('OAuth Config with provider') && error?.message?.includes('not found');
}
