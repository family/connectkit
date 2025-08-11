import { HookVariable } from '@/components/Variable/HookVariable'
import { useStatus } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/app/useStatus')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name='useStatus'
        hook={useStatus}
        description='This hook provides the current status of the OpenfortKit, including the user authentication state and UI state.'
      />
    </Layout>
  )
}
