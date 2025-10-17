import { useUser } from '@openfort/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { App } from '@/components/Showcase/app'

export const Route = createFileRoute('/_showcase/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isAuthenticated } = useUser()
  const nav = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      nav({ to: '/showcase/auth' })
    }
  }, [isAuthenticated, nav])

  if (isAuthenticated) {
    return <App />
  }

  return <></>
}
