import { createFileRoute } from '@tanstack/react-router'
import { useChainId, useSwitchChain } from 'wagmi'
import { Layout } from '@/components/Layout'
import { HookVariable } from '@/components/Variable/HookVariable'
import { BaseVariable } from '@/components/Variable/Variable'

export const Route = createFileRoute('/_hooks/wagmi/useSwitchChain')({
  component: RouteComponent,
})

function RouteComponent() {
  const { chains } = useSwitchChain()
  const chainId = useChainId()

  return (
    <Layout>
      <HookVariable
        name="useSwitchChain"
        hook={useSwitchChain}
        description="This hook switches the wallet of the user."
        variables={{
          switchChain: {
            description: 'Switch the wallet to a different chain.',
            inputs: {
              chainId: {
                description: 'The ID of the chain to switch to.',
                type: 'select',
                options: chains.map((chain) => ({
                  label: chain.name,
                  value: chain.id,
                })),
                required: true,
              },
            },
          },
        }}
      />
      <div className="border-t border-zinc-200 dark:border-zinc-700 mt-2 pt-2">
        <BaseVariable name="Current chainId (from useChainId)" value={chainId} />
      </div>
    </Layout>
  )
}
