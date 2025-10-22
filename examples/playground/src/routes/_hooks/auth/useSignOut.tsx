import { useSignOut } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { onSettledInputs, onSettledOptions } from '@/components/Variable/commonVariables'
import { HookVariable } from '@/components/Variable/HookVariable'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/auth/useSignOut')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name="useSignOut"
        hook={useSignOut}
        description="This hook allows you to sign out the current user."
        defaultOptions={{
          ...onSettledOptions,
        }}
        variables={{
          signOut: {
            description: 'Sign out the current user.',
            inputs: {
              ...onSettledInputs,
            },
          },
        }}
      />
    </Layout>
  )
}
