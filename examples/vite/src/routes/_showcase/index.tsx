import { App } from '@/components/Showcase/app'
import { useStatus } from '@openfort/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/_showcase/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isConnected, isLoading, isAuthenticated } = useStatus();
  const nav = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      nav({ to: "/auth" });
    }
  }, [isLoading, isAuthenticated, nav]);

  if (isLoading) return null;

  if (isAuthenticated) {
    return (
      <App />
    )
  }

  return (
    <>
    </>
  )
}
