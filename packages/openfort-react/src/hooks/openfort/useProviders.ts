import { useEffect } from 'react';
import { UIAuthProvider } from "../../components/Openfort/types";
import { useOpenfort } from '../../components/Openfort/useOpenfort';
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { OpenfortError, OpenfortErrorType } from '../../types';

export function useProviders() {
  const { user } = useOpenfortCore();
  const { uiConfig: options, thirdPartyAuth, setOpen } = useOpenfort();

  const allProviders = options?.authProviders || [];
  const providers: UIAuthProvider[] = allProviders.filter(p => p !== UIAuthProvider.GUEST) || [];

  const linkedProviders = user ? providers.filter(p => user.linkedAccounts?.find(a => a.provider === p)) : [];
  const availableProviders = user ?
    providers.filter(provider => {
      if (provider === UIAuthProvider.WALLET) return true; // Wallet is always available
      return !user.linkedAccounts?.find(a => a.provider === provider)
    })
    : providers;

  useEffect(() => {
    if (thirdPartyAuth) {
      setOpen(false);
      console.error(new OpenfortError(
        'When using external third party auth providers, openfort Auth providers are not available. Either remove the `thirdPartyAuth` or authenticate your users using Auth hooks.',
        OpenfortErrorType.CONFIGURATION_ERROR,
      ))
    }
  }, [])

  return {
    availableProviders,
    linkedProviders,
    allProviders,
  }
}