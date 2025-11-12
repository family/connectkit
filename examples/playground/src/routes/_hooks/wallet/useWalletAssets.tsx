import { useWalletAssets } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { polygonAmoy } from 'viem/chains'
import { HookVariable } from '@/components/Variable/HookVariable'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/wallet/useWalletAssets')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name="useWalletAssets"
        hook={useWalletAssets}
        description="This hook fetches the assets associated with the connected wallet."
        variables={{
          refetch: {
            type: 'function',
            description: 'Function to refetch the wallet assets.',
          },
        }}
        defaultOptions={{
          assets: [],
        }}
      />
    </Layout>
  )
}
