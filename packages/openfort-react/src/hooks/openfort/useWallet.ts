import { useWallets } from "./useWallets";

export function useWallet() {
  const { activeWallet } = useWallets();

  return activeWallet;
}
