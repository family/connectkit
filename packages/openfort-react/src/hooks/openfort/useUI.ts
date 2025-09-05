import { useOpenfort } from '../../components/Openfort/useOpenfort';
import { UIAuthProvider, routes } from "../../components/Openfort/types";
import { useOpenfortCore } from '../../openfort/useOpenfort';
import { useAccount } from 'wagmi';

type ModalRoutes = (typeof routes)[keyof typeof routes];

const safeRoutes: {
  connected: ModalRoutes[];
  disconnected: ModalRoutes[];
} = {
  disconnected: [
    routes.PROVIDERS,
    routes.CONNECTORS,
    // routes.ABOUT,
    // routes.ONBOARDING,
    routes.MOBILECONNECTORS,
  ],
  connected: [
    routes.PROFILE,
    routes.CONNECTORS,
    routes.SWITCHNETWORKS,
    routes.PROVIDERS,
  ],
};

const allRoutes: ModalRoutes[] = [
  ...safeRoutes.connected,
  ...safeRoutes.disconnected,
];

type ValidRoutes = ModalRoutes;


export function useUI() {
  const { open, setOpen, setRoute, log } = useOpenfort();
  const { isLoading, user, needsRecovery } = useOpenfortCore();
  const { isConnected } = useAccount();

  function defaultOpen() {
    setOpen(true);

    if (isLoading)
      setRoute(routes.LOADING);

    else if (!user)
      setRoute(routes.PROVIDERS);

    else if (!isConnected)
      setRoute(routes.RECOVER);

    else if (needsRecovery)
      setRoute(routes.RECOVER);
    else
      setRoute(routes.PROFILE);
  }

  const gotoAndOpen = (route: ValidRoutes) => {
    let validRoute: ValidRoutes = route;

    if (!allRoutes.includes(route)) {
      validRoute = isConnected ? routes.PROFILE : routes.PROVIDERS;
      log(
        `Route ${route} is not a valid route, navigating to ${validRoute} instead.`
      );
    } else {
      if (isConnected) {
        if (!safeRoutes.connected.includes(route)) {
          validRoute = routes.PROFILE;
          log(
            `Route ${route} is not a valid route when connected, navigating to ${validRoute} instead.`
          );
        }
      } else {
        if (!safeRoutes.disconnected.includes(route)) {
          validRoute = routes.PROVIDERS;
          log(
            `Route ${route} is not a valid route when disconnected, navigating to ${validRoute} instead.`
          );
        }
      }
    }

    setRoute(validRoute);
    setOpen(true);
  };

  return {
    isOpen: open,
    open: () => defaultOpen(),
    close: () => setOpen(false),
    setIsOpen: setOpen,

    openProfile: () => gotoAndOpen(routes.PROFILE),
    openSwitchNetworks: () => gotoAndOpen(routes.SWITCHNETWORKS),
    openProviders: () => gotoAndOpen(routes.PROVIDERS),
    openWallets: () => gotoAndOpen(routes.CONNECTORS),
  }
}