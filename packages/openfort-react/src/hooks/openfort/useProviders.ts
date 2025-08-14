import { useOpenfort } from '../../components/Openfort/useOpenfort';
import { AuthProvider } from "../../components/Openfort/types";
import { useOpenfortCore } from '../../openfort/useOpenfort';

export function useProviders() {
  const { user } = useOpenfortCore();
  const { uiConfig: options } = useOpenfort();

  const allProviders = options?.authProviders || [];
  const providers: AuthProvider[] = allProviders.filter(p => p !== AuthProvider.GUEST) || [];

  const linkedProviders = user ? providers.filter(p => user.linkedAccounts?.find(a => a.provider === p)) : [];
  const availableProviders = user ?
    providers.filter(provider => {
      if (provider === AuthProvider.WALLET) return true; // Wallet is always available
      return !user.linkedAccounts?.find(a => a.provider === provider)
    })
    : providers;

  return {
    availableProviders,
    linkedProviders,
    allProviders,
  }
}