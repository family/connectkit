import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../components/Layout'
import { Variable } from '../../components/Variable/Variable'
import { useUser } from '@openfort/openfort-kit'
import { HookVariable } from '@/components/Variable/HookVariable'

export const Route = createFileRoute('/user/useUser')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <Layout>
      <HookVariable
        name='useUser'
        hook={useUser}
        description='This hook provides access to the current user.'
        variables={{
          getAccessToken: {
            description: 'Get the user access token.',
          },
          validateAndRefreshToken: {
            description: 'Validate and refresh the user access token.',
          },
        }}
      />
    </Layout>
  )
}
