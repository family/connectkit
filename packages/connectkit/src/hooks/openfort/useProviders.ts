import { KitOAuthProvider, useFortKit } from "../../components/FortKit";
import { useOpenfort } from "../../openfort/OpenfortProvider";

export function useProviders() {
  const { user } = useOpenfort();
  const { options } = useFortKit();

  const providers = options?.authProviders?.filter(p => p !== KitOAuthProvider.GUEST) || [];

  const linkedProviders = user ? providers.filter(p => user.linkedAccounts?.find(a => a.provider === p)) : [];
  const unlinkedProviders = user ? providers.filter(p => !user.linkedAccounts?.find(a => a.provider === p)) : providers;

  return {
    unlinkedProviders,
    linkedProviders,
  }
}