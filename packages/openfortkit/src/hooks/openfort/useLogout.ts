import { useOpenfort } from "../../openfort/OpenfortProvider";

export function useLogout() {
  const { logout } = useOpenfort();

  return logout;
}