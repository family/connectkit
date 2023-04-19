import { useAccount } from 'wagmi';
import { routes, useContext } from '../components/ConnectKit';
import { useSIWE } from '../siwe';
import {
  useConnectCallback,
  useConnectCallbackProps,
} from './useConnectCallback';
import { useWallets } from '../wallets/useDefaultWallets';

type ModalRoutes = typeof routes[keyof typeof routes];

const safeRoutes: {
  connected: ModalRoutes[];
  disconnected: ModalRoutes[];
} = {
  disconnected: [
    routes.CONNECTORS,
    routes.CONNECT,
    routes.ABOUT,
    routes.ONBOARDING,
    routes.OTHERCONNECTORS,
    routes.ONBOARDING,
  ],
  connected: [routes.PROFILE, routes.SWITCHNETWORKS, routes.SIGNINWITHETHEREUM],
};
const allRoutes: ModalRoutes[] = [
  ...safeRoutes.connected,
  ...safeRoutes.disconnected,
];

type ValidRoutes = ModalRoutes;

type UseModalProps = {} & useConnectCallbackProps;

export const useModal = ({ onConnect, onDisconnect }: UseModalProps = {}) => {
  const context = useContext();
  const wallets = useWallets();
  const oneWallet = wallets.length === 1 ? wallets[0] : undefined;

  useConnectCallback({
    onConnect,
    onDisconnect,
  });

  const { isConnected } = useAccount();
  const { signIn } = useSIWE();

  const close = () => {
    context.setOpen(false);
  };
  const open = () => {
    context.setOpen(true);
  };
  const defaultOpen = () => {
    if (isConnected) {
      gotoAndOpen(routes.PROFILE);
    } else if (oneWallet) {
      context.setConnector(oneWallet.id);
      gotoAndOpen(routes.CONNECT);
    } else {
      gotoAndOpen(routes.CONNECTORS);
    }
  };

  const gotoAndOpen = (route: ValidRoutes) => {
    let validRoute: ValidRoutes = route;

    if (!allRoutes.includes(route)) {
      validRoute = isConnected ? routes.PROFILE : routes.CONNECTORS;
      context.log(
        `Route ${route} is not a valid route, navigating to ${validRoute} instead.`
      );
    } else {
      if (isConnected) {
        if (!safeRoutes.connected.includes(route)) {
          validRoute = routes.PROFILE;
          context.log(
            `Route ${route} is not a valid route when connected, navigating to ${validRoute} instead.`
          );
        }
      } else {
        if (!safeRoutes.disconnected.includes(route)) {
          validRoute = oneWallet ? routes.CONNECT : routes.CONNECTORS;
          context.log(
            `Route ${route} is not a valid route when disconnected, navigating to ${validRoute} instead.`
          );
        }
      }
    }

    context.setRoute(validRoute);
    open();
  };

  return {
    open: context.open,
    setOpen: (show: boolean) => {
      if (show) {
        defaultOpen();
      } else {
        close();
      }
    },
    // Disconnected Routes
    openAbout: () => gotoAndOpen(routes.ABOUT),
    openOnboarding: () => gotoAndOpen(routes.ONBOARDING),
    // Connected Routes
    openProfile: () => gotoAndOpen(routes.PROFILE),
    openSwitchNetworks: () => gotoAndOpen(routes.SWITCHNETWORKS),
    openSIWE: (triggerSIWE?: boolean) => {
      gotoAndOpen(routes.SIGNINWITHETHEREUM);
      if (triggerSIWE) signIn();
    },
  };
};
