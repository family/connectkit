import { AuthProvider, useOpenfortKit } from "../../components/OpenfortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";

export function useProviders() {
  const { user } = useOpenfort();
  const { options } = useOpenfortKit();

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