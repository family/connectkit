import { useWalletAuth } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { onSettledOptions } from '@/components/Variable/commonVariables'
import { HookVariable } from '@/components/Variable/HookVariable'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/auth/useWalletAuth')({
  component: RouteComponent,
})

function RouteComponent() {
  const walletAuth = useWalletAuth()
  const availableWalletIds = walletAuth.availableWallets.map((wallet) => wallet.id)

  return (
    <Layout>
      <HookVariable
        name="useWalletAuth"
        hook={useWalletAuth}
        description="This hook allows you to connect or link a wallet to your account."
        defaultOptions={{
          ...onSettledOptions,
        }}
        variables={{
          connectWallet: {
            description: 'Connect a wallet to the application.',
            inputs: {
              connector: {
                type: 'select',
                options: availableWalletIds,
                required: true,
              },
            },
          },
          linkWallet: {
            description: 'Link a wallet to an existing account.',
            inputs: {
              connector: {
                type: 'select',
                options: availableWalletIds,
                required: true,
              },
            },
          },
          availableWallets: {
            description: 'List of available wallets in device for connection.',
          },
        }}
      />
    </Layout>
  )
}
