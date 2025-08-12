import { HookVariable } from '@/components/Variable/HookVariable'
import { useWallet } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/wallet/useWallet')({
  component: RouteComponent,
})

const useNoHook = () => {
  return {}
}

function RouteComponent() {
  const wallet = useWallet()

  return (
    <Layout>
      {
        wallet ? (
          <HookVariable
            name='useWallet'
            // @ts-expect-error No object params
            hook={useWallet}
            description='This hook provides access to the wallets available in the application.'
          />
        ) : (
          <>
            <HookVariable
              name='useWallet'
              hook={useNoHook}
              description='This hook provides access to the wallets available in the application.'
            />
          </>
        )
      }
    </Layout>
  )
}
