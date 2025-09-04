import { HookVariable } from '@/components/Variable/HookVariable'
import { useWallet } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/wallet/useWallet')({
  component: RouteComponent,
})

const useWalletWrapper = () => {
  const wallet = useWallet()
  return wallet ? wallet : {}
}

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name='useWallet'
        hook={useWalletWrapper}
        description='This hook provides access to the wallets available in the application.'
      />
    </Layout>
  )
}
