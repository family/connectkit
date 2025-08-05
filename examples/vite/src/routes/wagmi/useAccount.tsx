import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../components/Layout'
import { Variable } from '../../components/Variable/Variable'
import { useAccount } from 'wagmi';

export const Route = createFileRoute('/wagmi/useAccount')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount();
  return (
    <Layout>
      <Variable
        name='useAccount'
        values={account}
        defaultExpanded={0}
      />
    </Layout>
  )
}
