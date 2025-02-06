import { KitOAuthProvider, useFortKit } from "../../components/FortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";

export function useProviders() {
  const { user } = useOpenfort();
  const { options } = useFortKit();

  const allProviders = options?.authProviders || [];
  const providers = allProviders.filter(p => p !== KitOAuthProvider.GUEST) || [];

  const linkedProviders = user ? providers.filter(p => user.linkedAccounts?.find(a => a.provider === p)) : [];
  const availableProviders = user ? providers.filter(p => !user.linkedAccounts?.find(a => a.provider === p)) : providers;

  return {
    availableProviders,
    linkedProviders,
    allProviders,
  }
}