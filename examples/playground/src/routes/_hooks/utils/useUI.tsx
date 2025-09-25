import { HookVariable } from '@/components/Variable/HookVariable'
import { useUI } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/utils/useUI')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name='useUI'
        hook={useUI}
        description='This hook provides access to the UI components and methods for managing the UI state.'
        variables={{
          open: {
            description: 'Open a UI component.',
          },
          close: {
            description: 'Close a UI component.',
          },
          openWallets: {
            description: 'Open the wallets UI.',
          },
          openProfile: {
            description: 'Open the user profile UI. If the user is not authenticated, it will open the login UI.',
          },
          openProviders: {
            description: 'Open the auth providers UI.',
          },
          openSwitchNetworks: {
            description: 'Open the switch networks UI.',
          },
        }}
      />
    </Layout>
  )
}
