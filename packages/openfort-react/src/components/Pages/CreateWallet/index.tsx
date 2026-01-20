import { EmbeddedState, RecoveryMethod } from '@openfort/openfort-js'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { FingerPrintIcon, KeyIcon, LockIcon, PlusIcon, ShieldIcon } from '../../../assets/icons'
import Logos from '../../../assets/logos'
import { useWallets } from '../../../hooks/openfort/useWallets'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import FitText from '../../Common/FitText'
import Input from '../../Common/Input'
import Loader from '../../Common/Loading'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import TickList from '../../Common/TickList'
import { FloatingGraphic } from '../../FloatingGraphic'
import { LinkWalletOnSignUpOption, routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent, type SetOnBackFunction } from '../../PageContent'
import { PasswordStrengthIndicator } from '../../PasswordStrength/PasswordStrengthIndicator'
import { getPasswordStrength, MEDIUM_SCORE_THRESHOLD } from '../../PasswordStrength/password-utility'
import Connectors from '../Connectors'
import { ProviderIcon, ProviderLabel, ProvidersButton } from '../Providers/styles'
import { OtherMethodButton } from './styles'

const OtherMethod = ({
  currentMethod,
  onChangeMethod,
}: {
  currentMethod: RecoveryMethod
  onChangeMethod: (method: RecoveryMethod | 'other') => void
}) => {
  const { uiConfig } = useOpenfort()
  const otherMethods = useMemo(() => {
    const allowedMethods = uiConfig.walletRecovery.allowedMethods
    const otherMethods = allowedMethods.filter((method) => method !== currentMethod)
    return otherMethods
  }, [uiConfig, currentMethod])

  if (otherMethods.length === 0) return null

  if (otherMethods.length === 1) {
    const method = otherMethods[0]
    let text: string
    switch (method) {
      case RecoveryMethod.PASSWORD:
        text = 'Use password recovery instead'
        break
      case RecoveryMethod.AUTOMATIC:
        text = 'Skip for now'
        break
      case RecoveryMethod.PASSKEY:
        text = 'Use passkey recovery instead'
        break
      default:
        text = method
    }
    return (
      <OtherMethodButton
        onClick={() => {
          onChangeMethod(method)
        }}
      >
        {text}
      </OtherMethodButton>
    )
  }

  return <OtherMethodButton onClick={() => onChangeMethod('other')}>Choose another recovery method</OtherMethodButton>
}

const CreateWalletAutomaticRecovery = ({
  onBack,
  logoutOnBack,
}: {
  onBack: SetOnBackFunction
  logoutOnBack: boolean
}) => {
  const { embeddedState } = useOpenfortCore()
  const { createWallet, error: recoveryError } = useWallets()
  const [shouldCreateWallet, setShouldCreateWallet] = useState(false)

  useEffect(() => {
    // To ensure the wallet is created only once
    if (shouldCreateWallet) {
      ;(async () => {
        logger.log('Creating wallet Automatic recover')
        const response = await createWallet()
        if (response.error) {
          logger.log('Error creating wallet', response.error)
        }
      })()
    }
  }, [shouldCreateWallet])

  useEffect(() => {
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      setShouldCreateWallet(true)
    }
  }, [embeddedState])

  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <Loader
        isError={!!recoveryError}
        header={recoveryError ? 'Error creating wallet.' : `Creating wallet...`}
        description={recoveryError ? recoveryError.message : undefined}
      />
    </PageContent>
  )
}

const CreateWalletPasskeyRecovery = ({
  onChangeMethod,
  onBack,
  logoutOnBack,
}: {
  onChangeMethod: (method: RecoveryMethod | 'other') => void
  onBack: SetOnBackFunction
  logoutOnBack: boolean
}) => {
  const { triggerResize } = useOpenfort()
  const { createWallet, error: recoveryError } = useWallets()
  const [shouldCreateWallet, setShouldCreateWallet] = useState(false)
  const { embeddedState } = useOpenfortCore()

  useEffect(() => {
    // To ensure the wallet is created only once
    if (shouldCreateWallet) {
      ;(async () => {
        logger.log('Creating wallet passkey recovery')
        const response = await createWallet({
          recovery: {
            recoveryMethod: RecoveryMethod.PASSKEY,
          },
        })
        if (response.error) {
          logger.log('Error creating wallet', response.error)
          setShouldCreateWallet(false)
        }
      })()
    }
  }, [shouldCreateWallet])

  useEffect(() => {
    if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
      setShouldCreateWallet(true)
    }
  }, [embeddedState])

  useEffect(() => {
    if (recoveryError) triggerResize()
  }, [recoveryError])

  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <Loader
        icon={<FingerPrintIcon />}
        isError={!!recoveryError}
        header={recoveryError ? 'Invalid passkey.' : 'Creating wallet with passkey...'}
        description={recoveryError ? 'There was an error creating your passkey. Please try again.' : undefined}
        onRetry={() => setShouldCreateWallet(true)}
      />
      <OtherMethod currentMethod={RecoveryMethod.PASSKEY} onChangeMethod={onChangeMethod} />
    </PageContent>
  )
}

const CreateWalletPasswordRecovery = ({
  onChangeMethod,
  onBack,
  logoutOnBack,
}: {
  onChangeMethod: (method: RecoveryMethod | 'other') => void
  onBack: SetOnBackFunction
  logoutOnBack: boolean
}) => {
  const [recoveryPhrase, setRecoveryPhrase] = useState('')
  const [recoveryError, setRecoveryError] = useState<false | string>(false)
  const { triggerResize } = useOpenfort()
  const [showPasswordIsTooWeakError, setShowPasswordIsTooWeakError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { createWallet } = useWallets()

  const handleSubmit = async () => {
    if (getPasswordStrength(recoveryPhrase) < MEDIUM_SCORE_THRESHOLD) {
      setShowPasswordIsTooWeakError(true)
      return
    }

    setLoading(true)

    const { error } = await createWallet({
      recovery: {
        recoveryMethod: RecoveryMethod.PASSWORD,
        password: recoveryPhrase,
      },
    })

    setLoading(false)

    if (error) {
      setRecoveryError(error.message || 'There was an error recovering your account')
    } else {
      logger.log('Recovery success')
    }
  }

  useEffect(() => {
    if (recoveryError) triggerResize()
  }, [recoveryError])

  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <FloatingGraphic
        height="80px"
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
      <ModalHeading>Secure your wallet</ModalHeading>
      <ModalBody style={{ textAlign: 'center' }}>
        <FitText>Set a password for your wallet.</FitText>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Input
            value={recoveryPhrase}
            onChange={(e) => {
              if (showPasswordIsTooWeakError) setShowPasswordIsTooWeakError(false)
              setRecoveryPhrase(e.target.value)
            }}
            type="password"
            placeholder="Enter your password"
            autoComplete="off"
          />

          <PasswordStrengthIndicator
            password={recoveryPhrase}
            showPasswordIsTooWeakError={showPasswordIsTooWeakError}
          />
          <TickList
            items={['You will use this password to access your wallet', "Make sure it's strong and memorable"]}
          />

          {recoveryError && (
            <motion.div key={recoveryError} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ModalBody style={{ height: 24, marginTop: 12 }} $error>
                <FitText>{recoveryError}</FitText>
              </ModalBody>
            </motion.div>
          )}

          <Button onClick={handleSubmit} waiting={loading} disabled={loading}>
            Create wallet
          </Button>
        </form>
        <OtherMethod currentMethod={RecoveryMethod.PASSWORD} onChangeMethod={onChangeMethod} />
      </ModalBody>
    </PageContent>
  )
}

const ChooseRecoveryMethod = ({
  onChangeMethod,
  onBack,
  logoutOnBack,
}: {
  onChangeMethod: (method: RecoveryMethod | 'other') => void
  onBack: SetOnBackFunction
  logoutOnBack: boolean
}) => {
  return (
    <PageContent onBack={onBack} logoutOnBack={logoutOnBack}>
      <ModalHeading>Choose a recovery method</ModalHeading>
      <ProvidersButton>
        <Button onClick={() => onChangeMethod(RecoveryMethod.PASSKEY)}>
          <ProviderLabel>Passkey</ProviderLabel>
          <ProviderIcon>
            <FingerPrintIcon />
          </ProviderIcon>
        </Button>
      </ProvidersButton>
      <ProvidersButton>
        <Button onClick={() => onChangeMethod(RecoveryMethod.PASSWORD)}>
          <ProviderLabel>Password</ProviderLabel>
          <ProviderIcon>
            <KeyIcon />
          </ProviderIcon>
        </Button>
      </ProvidersButton>
      <ProvidersButton>
        <Button onClick={() => onChangeMethod(RecoveryMethod.AUTOMATIC)}>
          <ProviderLabel>Automatic</ProviderLabel>
          <ProviderIcon>
            <LockIcon />
          </ProviderIcon>
        </Button>
      </ProvidersButton>
    </PageContent>
  )
}

const CreateEmbeddedWallet = ({ onBack, logoutOnBack }: { onBack: SetOnBackFunction; logoutOnBack: boolean }) => {
  const { uiConfig, triggerResize } = useOpenfort()
  const [userSelectedMethod, setUserSelectedMethod] = useState<RecoveryMethod | 'other' | null>(null)

  useEffect(() => {
    triggerResize()
  }, [userSelectedMethod])

  const method = userSelectedMethod ?? uiConfig.walletRecovery.defaultMethod

  switch (method) {
    case RecoveryMethod.PASSWORD:
      return (
        <CreateWalletPasswordRecovery
          onChangeMethod={setUserSelectedMethod}
          onBack={onBack}
          logoutOnBack={logoutOnBack}
        />
      )
    case RecoveryMethod.AUTOMATIC:
      return <CreateWalletAutomaticRecovery onBack={onBack} logoutOnBack={logoutOnBack} />
    case RecoveryMethod.PASSKEY:
      return (
        <CreateWalletPasskeyRecovery
          onChangeMethod={setUserSelectedMethod}
          onBack={onBack}
          logoutOnBack={logoutOnBack}
        />
      )
    case 'other':
      return (
        <ChooseRecoveryMethod
          onChangeMethod={setUserSelectedMethod}
          onBack={() => {
            setUserSelectedMethod(null)
          }}
          logoutOnBack={logoutOnBack}
        />
      )
    default:
      logger.error(`Unsupported recovery method: ${userSelectedMethod}${uiConfig.walletRecovery.defaultMethod}`)
      return null
  }
}

const CreateOrConnectWallet = () => {
  const [showCreateEmbeddedWallet, setShowCreateEmbeddedWallet] = useState(false)
  const { setRoute } = useOpenfort()

  if (showCreateEmbeddedWallet)
    return <CreateEmbeddedWallet onBack={() => setShowCreateEmbeddedWallet(false)} logoutOnBack={false} />
  return (
    <PageContent onBack={routes.PROVIDERS} logoutOnBack>
      <ModalHeading>Choose an option</ModalHeading>
      <ProvidersButton>
        <Button onClick={() => setShowCreateEmbeddedWallet(true)}>
          <ProviderLabel>Create Wallet</ProviderLabel>
          <ProviderIcon>
            <PlusIcon />
          </ProviderIcon>
        </Button>
      </ProvidersButton>
      <ProvidersButton>
        <Button
          onClick={() => {
            setRoute({ route: routes.CONNECTORS, connectType: 'link' })
          }}
        >
          <ProviderLabel>Connect Wallet</ProviderLabel>
          <ProviderIcon>
            <Logos.OtherWallets />
          </ProviderIcon>
        </Button>
      </ProvidersButton>
    </PageContent>
  )
}

const CreateWallet: React.FC = () => {
  const { uiConfig, walletConfig, setRoute } = useOpenfort()
  const { user } = useOpenfortCore()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && user) setRoute(routes.CONNECTED_SUCCESS)
  }, [isConnected, user])

  if (uiConfig.linkWalletOnSignUp === LinkWalletOnSignUpOption.OPTIONAL) {
    return <CreateOrConnectWallet />
  }

  if (
    uiConfig.linkWalletOnSignUp === LinkWalletOnSignUpOption.REQUIRED ||
    (!walletConfig && uiConfig.linkWalletOnSignUp !== LinkWalletOnSignUpOption.DISABLED)
  ) {
    return <Connectors logoutOnBack={true} />
  }

  return <CreateEmbeddedWallet onBack={routes.PROVIDERS} logoutOnBack />
}

export default CreateWallet
