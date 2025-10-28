import { useEffect, useState } from 'react'
import type { RouteOptions } from '../components/Openfort/types'
import { useOpenfort } from '../components/Openfort/useOpenfort'
import { logger } from '../utils/logger'

// Hook to get the props of a specific route
// It ensures that the current route matches the expected route
export const useRouteProps = <T extends RouteOptions['route']>(currentRoute: T) => {
  const { route } = useOpenfort()
  const [savedRoute, setSavedRoute] = useState<Extract<RouteOptions, { route: T }>>()

  useEffect(() => {
    if (route.route !== currentRoute) {
      logger.error(
        `Route mismatch: must be used with route '${currentRoute.toUpperCase()}' but current route is '${route.route.toUpperCase()}'.\nPlease contact support if you see this message as this is likely a bug.`
      )
    } else {
      setSavedRoute(route as Extract<RouteOptions, { route: T }>)
    }
  }, [])

  if (route.route === currentRoute) {
    return route as Extract<RouteOptions, { route: T }>
  } else {
    return savedRoute as Extract<RouteOptions, { route: T }>
  }
}
