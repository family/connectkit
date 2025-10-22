import { AuthProvider, useOAuth } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { onSettledInputs, onSettledOptions } from '@/components/Variable/commonVariables'
import { HookVariable } from '@/components/Variable/HookVariable'
import type { FunctionInputType } from '../../../components/Form/Form'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/auth/useOauth')({
  component: RouteComponent,
})

function RouteComponent() {
  const inputs: Record<string, FunctionInputType> = {
    provider: {
      type: 'select',
      options: [AuthProvider.GOOGLE, AuthProvider.TWITTER, AuthProvider.FACEBOOK],
      required: true,
    },
    redirectTo: {
      type: 'text',
    },
    ...onSettledInputs,
  }

  return (
    <Layout>
      <HookVariable
        name="useOAuth"
        description="This hook allows you to initiate OAuth authentication with various providers."
        hook={useOAuth}
        defaultOptions={{
          redirectTo: '/auth/useAuthCallback', // Default redirect after OAuth flow
          ...onSettledOptions,
        }}
        variables={{
          initOAuth: {
            description: 'Initialize OAuth flow.',
            inputs: inputs,
          },
          linkOauth: {
            description: 'Link OAuth to an existing user.',
            inputs: inputs,
          },
        }}
      />
    </Layout>
  )
}
