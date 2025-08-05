import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../components/Layout'
import { Variable } from '../../components/Variable/Variable'
import { useAccount, useBalance } from 'wagmi';

export const Route = createFileRoute('/wagmi/useBalance')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount();
  const balance = useBalance({
    address: account.address,
    
  });
  return (
    <Layout>
      <Variable
        name='useBalance'
        values={balance}
        defaultExpanded={0}
        variables={{
          refetch: {
            description: 'Refetch the balance for the current account.',
          }
        }}
      />
    </Layout>
  )
}
