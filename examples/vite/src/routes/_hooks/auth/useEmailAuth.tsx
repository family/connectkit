import { HookVariable } from '@/components/Variable/HookVariable';
import { onSettledOptions, onSettledInputs } from '@/components/Variable/commonVariables';
import { useEmailAuth } from '@openfort/openfort-kit';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../../components/Layout';

export const Route = createFileRoute('/_hooks/auth/useEmailAuth')({
  component: RouteComponent,
})


function RouteComponent() {

  return (
    <Layout>

      <HookVariable
        name="useEmailAuth"
        hook={useEmailAuth}
        description='This hook allows you to sign up or sign in with email and password, link'
        defaultOptions={{
          emailVerificationRedirectTo: location.origin + "/auth/useAuthCallback",
          ...onSettledOptions
        }}

        optionsVariables={{
          emailVerificationRedirectTo: {
            type: 'text',
            description: 'The URL to redirect to after email verification.',
          },
        }}

        variables={{
          signInEmail: {
            inputs: {
              email: {
                type: 'email',
                required: true,
              },
              password: {
                type: 'text',
                required: true,
              },
              emailVerificationRedirectTo: {
                type: 'text',
              },
              ...onSettledInputs,
            },
            description: 'Sign in with email and password.',
          },
          signUpEmail: {
            inputs: {
              name: {
                type: 'text',
              },
              email: {
                type: 'email',
                required: true,
              },
              password: {
                type: 'text',
                required: true,
              },
              emailVerificationRedirectTo: {
                type: 'text',
              },
              ...onSettledInputs,
            },
            description: 'Sign up with email and password.',
          },
          linkEmail: {
            inputs: {
              email: {
                type: 'email',
                required: true,
              },
              password: {
                type: 'text',
                required: true,
              },
              emailVerificationRedirectTo: {
                type: 'text',
              },
              ...onSettledInputs,
            },
            description: 'Link email to an existing account.',
          },
          requestResetPassword: {
            inputs: {
              email: {
                type: 'email',
                required: true,
              },
              emailVerificationRedirectTo: {
                type: 'text',
              },
              ...onSettledInputs,
            },
            description: 'Request a password reset link to be sent to the user\'s email.',
          },
          resetPassword: {
            inputs: {
              email: {
                type: 'email',
                required: true,
              },
              password: {
                type: 'text',
                required: true,
              },
              state: {
                type: 'text',
                required: true,
              },
              emailVerificationRedirectTo: {
                type: 'text',
              },
              ...onSettledInputs,
            },
            description: 'Reset the user\'s password using a reset link.',
          }
        }}
      />

    </Layout>
  )
}
