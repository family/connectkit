import { useStatus } from '@openfort/react'
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_showcase/showcase/auth')({
  component: RouteComponent,
})

function RouteComponent() {

  const { isConnected, isAuthenticated } = useStatus();
  const nav = useNavigate();

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      nav({ to: "/" });
    }
  }, [isConnected, isAuthenticated, nav]);

  return (
    <Outlet />
  )
}
