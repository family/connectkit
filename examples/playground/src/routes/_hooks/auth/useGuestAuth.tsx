import { onSettledInputs, onSettledOptions } from '@/components/Variable/commonVariables';
import { HookVariable } from '@/components/Variable/HookVariable';
import { useGuestAuth } from '@openfort/react';
import { createFileRoute } from '@tanstack/react-router';
import { Layout } from '../../../components/Layout';

export const Route = createFileRoute('/_hooks/auth/useGuestAuth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout>
      <HookVariable
        hook={useGuestAuth}
        name="useGuestAuth"
        description='This hook allows you to sign up as a guest user.'

        defaultOptions={{
          recoverWalletAutomatically: true,
          ...onSettledOptions,
        }}

        optionsVariables={{
          recoverWalletAutomatically: {
            description: 'Whether to automatically recover the wallet of the user. Default is true.',
            type: 'boolean',
          },
        }}

        variables={{
          signUpGuest: {
            description: 'Sign up as a guest user.',
            inputs: {
              recoverWalletAutomatically: {
                description: 'Whether to automatically recover the wallet of the user. Default is true.',
                type: 'boolean',
                defaultValue: "true",
              },
              ...onSettledInputs,
            },
          }
        }}
      />
    </Layout>
  )
}
