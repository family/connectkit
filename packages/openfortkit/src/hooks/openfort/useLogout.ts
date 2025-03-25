import { useOpenfort } from '../../openfort/useOpenfort';

export function useLogout() {
  const { logout } = useOpenfort();

  return logout;
}