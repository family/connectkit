
import { HookVariable } from '@/components/Variable/HookVariable';
import { onSettledInputs, onSettledOptions } from '@/components/Variable/commonVariables';
import { useSignOut } from '@openfort/openfort-kit';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../components/Layout';

export const Route = createFileRoute('/auth/useSignOut')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <Layout>
      <HookVariable
        name="useSignOut"
        hook={useSignOut}
        description='This hook allows you to sign out the current user.'
        defaultOptions={{
          ...onSettledOptions,
        }}

        variables={{
          signOut: {
            description: 'Sign out the current user.',
            inputs: {
              ...onSettledInputs
            }
          }
        }}
      />
    </Layout>
  )
}
