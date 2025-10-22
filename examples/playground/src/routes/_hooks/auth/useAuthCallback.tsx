import { useAuthCallback } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { onSettledInputs, onSettledOptions } from '@/components/Variable/commonVariables'
import { HookVariable } from '@/components/Variable/HookVariable'
import { Layout } from '../../../components/Layout'

export const Route = createFileRoute('/_hooks/auth/useAuthCallback')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        name="useAuthCallback"
        description="This hook handles the authentication callback after OAuth or email verification."
        hook={useAuthCallback}
        defaultOptions={{
          enabled: true,
          ...onSettledOptions,
        }}
        optionsVariables={{
          enabled: {
            type: 'boolean',
            description: 'Whether to automatically handle the callback.',
          },
        }}
        variables={{
          storeCredentials: {
            inputs: {
              accessToken: {
                type: 'text',
                required: true,
              },
              refreshToken: {
                type: 'text',
                required: true,
              },
              player: {
                type: 'text',
                required: true,
              },
              ...onSettledInputs,
            },
            description: 'Store credentials after auth callback.',
          },
          verifyEmail: {
            inputs: {
              email: {
                type: 'email',
                required: true,
                placeholder: 'email to verify',
              },
              state: {
                type: 'text',
                required: true,
              },
              ...onSettledInputs,
            },
            description: 'Verify email after user signs up with email.',
          },
        }}
      />
    </Layout>
  )
}
