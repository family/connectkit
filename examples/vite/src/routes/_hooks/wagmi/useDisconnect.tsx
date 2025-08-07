import { Layout } from '@/components/Layout'
import { HookVariable } from '@/components/Variable/HookVariable'
import { createFileRoute } from '@tanstack/react-router'
import { useDisconnect } from 'wagmi'

export const Route = createFileRoute('/_hooks/wagmi/useDisconnect')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name='useDisconnect'
        hook={useDisconnect}
        description='This hook disconnects the wallet of the user. The user will still be authenticated, but without a wallet connected.'
        variables={{
          disconnect: {
            description: 'Disconnect the wallet.',
          },
          connectors: {
            description: 'List of available connectors that can be disconnected.',
          }
        }}
      />
    </Layout>
  )
}
