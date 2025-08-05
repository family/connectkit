import { createFileRoute } from '@tanstack/react-router';
import { useDisconnect } from 'wagmi';
import { Layout } from '../../components/Layout';
import { Variable } from '../../components/Variable/Variable';

export const Route = createFileRoute('/wagmi/useDisconnect')({
  component: RouteComponent,
})

function RouteComponent() {
  const disconnect = useDisconnect();
  return (
    <Layout>
      <Variable
        name='useDisconnect'
        values={disconnect}
        defaultExpanded={0}
        variables={{
          disconnect: {
            inputs:
            {
              connector: {
                type: 'select',
                options: disconnect.connectors.map(connector => (
                  { label: connector.id, value: connector }
                )),
              }
            },
            description: 'Disconnect the wallet.',
          },
          reset: {
            description: 'A function to clean the mutation internal state (e.g. it resets the mutation to its initial state).',
          },
        }}
      />
    </Layout>
  )
}
