import { HookVariable } from '@/components/Variable/HookVariable'
import { useUser } from '@openfort/openfort-kit'
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/app/useUser')({
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
