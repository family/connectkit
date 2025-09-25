import { HookVariable } from '@/components/Variable/HookVariable'
import { embeddedWalletId, RecoveryMethod, useWallets } from '@openfort/react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Layout } from '../../../components/Layout'
import { onSettledOptions } from '@/components/Variable/commonVariables'

export const Route = createFileRoute('/_hooks/wallet/useWallets')({
  component: RouteComponent,
})

function RouteComponent() {
  const wallets = useWallets()
  const connectorOptions = useMemo(() => (
    wallets.wallets.map(wallet => wallet.id).reduce((acc, id) => {
      if (!acc.includes(id)) {
        acc.push(id)
      }
      return acc
    }, [] as string[])
  ), [wallets.wallets])

  const [isOpenfortWallet, setIsOpenfortWallet] = useState(connectorOptions[0] === embeddedWalletId)

  useEffect(() => {
    setIsOpenfortWallet(connectorOptions[0] === embeddedWalletId);
  }, [connectorOptions]);


  // wallets.setActiveWallet({
  //   walletId,
  //   recovery: {
  //     password
  //   }
  // })
  return (
    <Layout>
      <HookVariable
        name='useWallets'
        hook={useWallets}
        description='This hook provides access to the wallets available in the application.'
        defaultOptions={onSettledOptions}
        variables={{
          setActiveWallet: {
            description: 'Set the active wallet for the application.',
            inputs: {
              showUI: {
                type: 'boolean',
                defaultValue: "false",
                required: true,
              },
              walletId: {
                type: 'select',
                options: connectorOptions,
                required: true,
                onChange: (value) => {
                  console.log("---", value);
                  setIsOpenfortWallet(value === embeddedWalletId);
                }
              },
              "recovery.recoveryMethod": {
                type: 'select',
                options: ["undefined", 'PASSWORD', 'PASSKEY', 'AUTOMATIC'],
                hidden: !isOpenfortWallet,
              },
              "recovery.password": {
                type: 'password',
                hidden: !isOpenfortWallet,
              },
              address: {
                type: 'text',
                placeholder: '0x1234...',
              },
            }
          },
          exportPrivateKey: {
            description: 'Export the private key of the active wallet.',
          },
          createWallet: {
            description: 'Create a new wallet.',
            inputs: {
              "recovery.recoveryMethod": {
                type: 'select',
                options: ["undefined", RecoveryMethod.PASSWORD, RecoveryMethod.PASSKEY, RecoveryMethod.AUTOMATIC],
              },
              "recovery.password": {
                type: 'password',
              },
            },
          },
          availableWallets: {
            description: 'List of available wallets in the application.',
          },
          activeWallet: {
            description: 'The currently active wallet in the application.',
            typescriptType: 'Wallet',
          },
          wallets: {
            description: 'List of the wallets of the user.',
            typescriptType: 'Wallet[]',
          },
        }}
      />
    </Layout>
  )
}
