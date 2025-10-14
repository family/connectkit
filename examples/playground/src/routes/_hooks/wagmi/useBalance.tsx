import { Layout } from '@/components/Layout'
import { HookVariable } from '@/components/Variable/HookVariable'
import { createFileRoute } from '@tanstack/react-router'
import { useAccount, useBalance } from 'wagmi'

export const Route = createFileRoute('/_hooks/wagmi/useBalance')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount();

  return (
    <Layout>
      <HookVariable
        name='useBalance'
        hook={useBalance}
        optionsVariables={{
          address: {
            description: 'The address to fetch the balance for. If not provided, it will use the connected wallet address.',
          },
        }}
        defaultOptions={{
          address,
        }}
        description='This hook provides access to the account balance information.'
        variables={{
          refetch: {
            description: 'Function to refetch the balance.',
          }
        }}
      />
    </Layout>
  )
}
