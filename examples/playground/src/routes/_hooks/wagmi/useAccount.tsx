import { createFileRoute } from '@tanstack/react-router'
import { useAccount } from 'wagmi'
import { Layout } from '@/components/Layout'
import { HookVariable } from '@/components/Variable/HookVariable'

export const Route = createFileRoute('/_hooks/wagmi/useAccount')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name="useAccount"
        hook={useAccount}
        description="This hook provides access to the user account information."
      />
    </Layout>
  )
}
