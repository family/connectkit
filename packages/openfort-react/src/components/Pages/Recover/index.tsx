import { EmbeddedState, RecoveryMethod } from '@openfort/openfort-js'
import { motion } from 'framer-motion'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Hex } from 'viem'
import { useEnsName } from 'wagmi'
import { FingerPrintIcon, KeyIcon, LockIcon, ShieldIcon } from '../../../assets/icons'
import { embeddedWalletId } from '../../../constants/openfort'
import { type UserWallet, useWallets } from '../../../hooks/openfort/useWallets'
import { useEnsFallbackConfig } from '../../../hooks/useEnsFallbackConfig'
import { useRouteProps } from '../../../hooks/useRouteProps'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { truncateEthAddress } from '../../../utils'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import CopyToClipboard from '../../Common/CopyToClipboard'
import FitText from '../../Common/FitText'
import Input from '../../Common/Input'
import Loader from '../../Common/Loading'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent, type SetOnBackFunction } from '../../PageContent'

// TODO: Localize

const RecoverPasswordWallet = ({
  wallet,
  onBack,
  logoutOnBack,
}: {
  wallet: UserWallet
  onBack: SetOnBackFunction
  logoutOnBack?: boolean
}) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('')
  const [recoveryError, setRecoveryError] = useState<false | string>(false)
  const { triggerResize, setRoute } = useOpenfort()
  const [loading, setLoading] = useState(false)
  const { setActiveWallet } = useWallets()

  const handleSubmit = async () => {
    setLoading(true)

    const { error } = await setActiveWallet({
      walletId: embeddedWalletId,
      recovery: {
        recoveryMethod: RecoveryMethod.PASSWORD,
        password: recoveryPhrase,
      },
      address: wallet.address,
    })
    setLoading(false)

    if (error) {
      setRecoveryError(error.message || 'There was an error recovering your account')
    } else {
      setRoute(routes.CONNECTED)
    }
  }

  useEffect(() => {
    if (recoveryError) triggerResize()
  }, [recoveryError])

  const { data: ensName } = useEnsName({
    chainId: 1,
    address: wallet.address,
  })

  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <FloatingGraphic
        height="130px"
        logoCenter={{
          logo: <KeyIcon />,
          size: '1.2',
        }}
        logoTopLeft={{
          logo: <ShieldIcon />,
          size: '0.75',
        }}
        logoBottomRight={{
          logo: <LockIcon />,
          size: '0.5',
        }}
      />
      <ModalHeading>Recover wallet</ModalHeading>
      <ModalBody style={{ textAlign: 'center' }}>
        Please enter the recovery password to recover wallet{' '}
        <CopyToClipboard string={wallet.address}>{ensName ?? truncateEthAddress(wallet.address)}</CopyToClipboard>
      </ModalBody>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Input
          value={recoveryPhrase}
          onChange={(e) => setRecoveryPhrase(e.target.value)}
          type="password"
          placeholder="Enter your password"
          autoComplete="off"
        />

        {recoveryError && (
          <motion.div key={recoveryError} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalBody style={{ height: 24, marginTop: 12 }} $error>
              <FitText>{recoveryError}</FitText>
            </ModalBody>
          </motion.div>
        )}
        <Button onClick={handleSubmit} waiting={loading} disabled={loading}>
          Recover wallet
        </Button>
      </form>
    </PageContent>
  )
}

const RecoverPasskeyWallet = ({
  wallet,
  onBack,
  logoutOnBack,
}: {
  wallet: UserWallet
  onBack: SetOnBackFunction
  logoutOnBack?: boolean
}) => {
  const { triggerResize } = useOpenfort()
  const { setActiveWallet, error: recoveryError } = useWallets()
  const [shouldRecoverWallet, setShouldRecoverWallet] = useState(false)
  const { setRoute } = useOpenfort()

  const recoverWallet = async () => {
    const { error } = await setActiveWallet({
      walletId: embeddedWalletId,
      recovery: {
        recoveryMethod: RecoveryMethod.PASSKEY,
      },
      address: wallet.address,
    })

    if (!error) {
      setRoute(routes.CONNECTED)
    }
  }

  useEffect(() => {
    // To ensure the wallet is created only once
    if (shouldRecoverWallet) {
      recoverWallet()
    }
  }, [shouldRecoverWallet])

  useEffect(() => {
    setShouldRecoverWallet(true)
  }, [])

  useEffect(() => {
    if (recoveryError) triggerResize()
  }, [recoveryError])

  const ensFallbackConfig = useEnsFallbackConfig()
  const { data: ensName } = useEnsName({
    chainId: 1,
    address: wallet.address,
    config: ensFallbackConfig,
  })
  const walletDisplay = ensName ?? truncateEthAddress(wallet.address)

  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <Loader
        icon={<FingerPrintIcon />}
        isError={!!recoveryError}
        header={recoveryError ? 'Invalid passkey.' : `Recovering wallet ${walletDisplay} with passkey...`}
        description={recoveryError ? 'There was an error creating your passkey. Please try again.' : undefined}
        onRetry={() => recoverWallet()}
      />
    </PageContent>
  )
}

const RecoverAutomaticWallet = ({
  walletAddress,
  onBack,
  logoutOnBack,
}: {
  walletAddress: Hex
  onBack: SetOnBackFunction
  logoutOnBack?: boolean
}) => {
  const { embeddedState } = useOpenfortCore()
  const { setActiveWallet } = useWallets()
  const { setRoute } = useOpenfort()
  const [error, setError] = useState<false | string>(false)

  const recoverWallet = useCallback(async () => {
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      logger.log('Automatically recovering wallet', walletAddress)

      const response = await setActiveWallet({
        walletId: embeddedWalletId,
      })

      if (response.error) {
        setError(response.error.message || 'There was an error recovering your account')
        logger.log('Error recovering wallet', response.error)
      } else {
        setRoute(routes.CONNECTED)
      }
    }
  }, [walletAddress, setActiveWallet, setRoute])

  const shouldRecoverWallet = useRef(false)
  useEffect(() => {
    if (shouldRecoverWallet.current) return
    shouldRecoverWallet.current = true
    recoverWallet()
  }, [])

  if (error) {
    return (
      <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
        <ModalBody style={{ textAlign: 'center' }} $error>
          <FitText>{error}</FitText>
        </ModalBody>
      </PageContent>
    )
  }

  return (
    <PageContent>
      <Loader header={`Recovering wallet...`} />
    </PageContent>
  )
}

const RecoverWallet = ({
  wallet,
  onBack,
  logoutOnBack,
}: {
  wallet: UserWallet
  onBack: SetOnBackFunction
  logoutOnBack?: boolean
}) => {
  switch (wallet.recoveryMethod) {
    case RecoveryMethod.PASSWORD:
      return <RecoverPasswordWallet wallet={wallet} onBack={onBack} logoutOnBack={logoutOnBack} />
    case RecoveryMethod.AUTOMATIC:
      return <RecoverAutomaticWallet walletAddress={wallet.address} onBack={onBack} logoutOnBack={logoutOnBack} />
    case RecoveryMethod.PASSKEY:
      return <RecoverPasskeyWallet wallet={wallet} onBack={onBack} logoutOnBack={logoutOnBack} />
    default:
      logger.error(`Unsupported recovery method: ${wallet.recoveryMethod}, defaulting to automatic.`)
      return <RecoverAutomaticWallet walletAddress={wallet.address} onBack={onBack} logoutOnBack={logoutOnBack} />
  }
}

const RecoverPage: React.FC = () => {
  const { previousRoute } = useOpenfort()
  const { wallet } = useRouteProps(routes.RECOVER_WALLET)

  const { onBack, logoutOnBack } = useMemo<{
    onBack: SetOnBackFunction
    logoutOnBack?: boolean
  }>(() => {
    if (previousRoute?.route === routes.SELECT_WALLET_TO_RECOVER) {
      return {
        onBack: 'back',
        logoutOnBack: false,
      }
    }

    return { onBack: routes.PROVIDERS, logoutOnBack: true }
  }, [previousRoute])

  return <RecoverWallet wallet={wallet} onBack={onBack} logoutOnBack={logoutOnBack} />
}

export default RecoverPage
