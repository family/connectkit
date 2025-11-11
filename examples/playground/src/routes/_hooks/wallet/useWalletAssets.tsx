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
        description="This hook provides access to the wallets available in the application."
        variables={{
          refetch: {
            type: 'function',
            description: 'Function to refetch the wallet assets.',
          },
        }}
        optionsVariables={{
          assets: {
            type: 'select',
            options: [
              {
                label: 'No custom assets',
                value: {
                  [polygonAmoy.id]: [
                    {
                      address: '0xef147ed8bb07a2a0e7df4c1ac09e96dec459ffac',
                      decimals: 0,
                    },
                  ],
                },
              },
              {
                label: 'Custom Asset 1',
                value: [{}],
              },
              {
                label: 'Custom Asset 2',
                value: [{ address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' }],
              },
            ],
            description: 'Comma-separated list of asset IDs to include.',
          },
        }}
        defaultOptions={{
          assets: [],
        }}
      />
    </Layout>
  )
}
