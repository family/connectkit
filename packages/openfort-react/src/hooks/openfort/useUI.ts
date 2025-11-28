import { useAccount } from 'wagmi'
import { type RouteOptions, type RoutesWithoutOptions, routes } from '../../components/Openfort/types'
import { useOpenfort } from '../../components/Openfort/useOpenfort'
import { useOpenfortCore } from '../../openfort/useOpenfort'
import { logger } from '../../utils/logger'

type ModalRoutes = RoutesWithoutOptions['route'] | RouteOptions

const safeRoutes: {
  connected: ModalRoutes[]
  disconnected: ModalRoutes[]
} = {
  disconnected: [
    routes.PROVIDERS,
    { route: routes.CONNECTORS, connectType: 'linkIfUserConnectIfNoUser' },
    // routes.ABOUT,
    // routes.ONBOARDING,
    routes.MOBILECONNECTORS,
  ],
  connected: [
    routes.CONNECTED,
    { route: routes.CONNECTORS, connectType: 'linkIfUserConnectIfNoUser' },
    routes.SWITCHNETWORKS,
    routes.PROVIDERS,
  ],
}

const allRoutes: ModalRoutes[] = [...safeRoutes.connected, ...safeRoutes.disconnected]

type ValidRoutes = ModalRoutes

/**
 * Hook for controlling Openfort UI modal and navigation
 *
 * This hook provides programmatic control over the Openfort UI modal, including opening,
 * closing, and navigating between different screens. It handles route validation and
 * automatically selects appropriate screens based on user connection and authentication state.
 * The hook ensures safe navigation by validating routes against user's current state.
 *
 * @returns UI control functions and modal state
 *
 * @example
 * ```tsx
 * const ui = useUI();
 *
 * // Check if modal is open
 * if (ui.isOpen) {
 *   console.log('Openfort modal is currently open');
 * }
 *
 * // Open modal with default route (auto-determined by user state)
 * const handleConnect = () => {
 *   ui.open(); // Opens providers screen if not connected, profile if connected
 * };
 *
 * // Close modal
 * const handleClose = () => {
 *   ui.close();
 * };
 *
 * // Programmatically control modal state
 * const toggleModal = () => {
 *   ui.setIsOpen(!ui.isOpen);
 * };
 *
 * // Open specific screens
 * const handleProfileClick = () => {
 *   ui.openProfile(); // Opens user profile screen (connected users only)
 * };
 *
 * const handleProvidersClick = () => {
 *   ui.openProviders(); // Opens authentication providers screen
 * };
 *
 * const handleWalletsClick = () => {
 *   ui.openWallets(); // Opens wallet connectors screen
 * };
 *
 * const handleNetworkClick = () => {
 *   ui.openSwitchNetworks(); // Opens network switching screen (connected users only)
 * };
 *
 * // Example usage in component
 * return (
 *   <div>
 *     <button onClick={handleConnect}>
 *       {ui.isOpen ? 'Close' : 'Open'} Openfort
 *     </button>
 *     <button onClick={handleProfileClick}>Profile</button>
 *     <button onClick={handleWalletsClick}>Wallets</button>
 *   </div>
 * );
 * ```
 */
export function useUI() {
  const { open, setOpen, setRoute } = useOpenfort()
  const { isLoading, user, needsRecovery } = useOpenfortCore()
  const { isConnected } = useAccount()

  function defaultOpen() {
    setOpen(true)

    if (isLoading) setRoute(routes.LOADING)
    else if (!user) setRoute(routes.PROVIDERS)
    else if (!isConnected) setRoute(routes.LOAD_WALLETS)
    else if (needsRecovery) setRoute(routes.LOAD_WALLETS)
    else setRoute(routes.CONNECTED)
  }

  const gotoAndOpen = (route: ValidRoutes) => {
    let validRoute: ValidRoutes = route

    if (!allRoutes.includes(route)) {
      validRoute = isConnected ? routes.CONNECTED : routes.PROVIDERS
      logger.log(`Route ${route} is not a valid route, navigating to ${validRoute} instead.`)
    } else {
      if (isConnected) {
        if (!safeRoutes.connected.includes(route)) {
          validRoute = routes.CONNECTED
          logger.log(`Route ${route} is not a valid route when connected, navigating to ${validRoute} instead.`)
        }
      } else {
        if (!safeRoutes.disconnected.includes(route)) {
          validRoute = routes.PROVIDERS
          logger.log(`Route ${route} is not a valid route when disconnected, navigating to ${validRoute} instead.`)
        }
      }
    }

    setRoute(validRoute)
    setOpen(true)
  }

  return {
    isOpen: open,
    open: () => defaultOpen(),
    close: () => setOpen(false),
    setIsOpen: setOpen,

    openProfile: () => gotoAndOpen(routes.CONNECTED),
    openSwitchNetworks: () => gotoAndOpen(routes.SWITCHNETWORKS),
    openProviders: () => gotoAndOpen(routes.PROVIDERS),
    openWallets: () => gotoAndOpen({ route: routes.CONNECTORS, connectType: 'linkIfUserConnectIfNoUser' }),
  }
}
