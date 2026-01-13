import { OAuthProvider } from '@openfort/openfort-js'
import { AnimatePresence, motion } from 'framer-motion'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useAccount, useDisconnect } from 'wagmi'
import { EmailIcon, GuestIcon, PhoneIcon } from '../../../assets/icons'
import Logos, { OtherSocials, providersLogos } from '../../../assets/logos'
import { useProviders } from '../../../hooks/openfort/useProviders'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { logger } from '../../../utils/logger'
import { isValidEmail as isValidEmailFn } from '../../../utils/validation'
import Button from '../../Common/Button'
import Loader from '../../Common/Loading'
import { ModalHeading } from '../../Common/Modal/styles'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { routes, socialProviders, UIAuthProvider } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import type { SetOnBackFunction } from '../../PageContent'
import { PageContent } from '../../PageContent'
import {
  EmailInnerButton,
  ProviderIcon,
  ProviderInputInner,
  ProviderLabel,
  ProvidersButton as ProvidersButtonStyle,
} from './styles'

const ProviderButtonBase: React.FC<{
  onClick: () => void
  icon?: React.ReactNode
  children?: React.ReactNode
}> = ({ children, icon, onClick }) => {
  return (
    <ProvidersButtonStyle>
      <Button onClick={onClick}>
        <ProviderLabel>{children}</ProviderLabel>
        <ProviderIcon>{icon}</ProviderIcon>
      </Button>
    </ProvidersButtonStyle>
  )
}

const GuestButton: React.FC = () => {
  const { setRoute } = useOpenfort()

  const handleClick = () => {
    setRoute(routes.CREATE_GUEST_USER)
  }

  return (
    <ProviderButtonBase onClick={handleClick} icon={<GuestIcon />}>
      Guest
    </ProviderButtonBase>
  )
}

const WalletButton: React.FC = () => {
  const { setRoute } = useOpenfort()
  const { user } = useOpenfortCore()
  return (
    <ProviderButtonBase
      onClick={() => setRoute({ route: routes.CONNECTORS, connectType: user ? 'link' : 'connect' })}
      icon={<Logos.OtherWallets />}
    >
      Wallet
    </ProviderButtonBase>
  )
}

const EmailButton: React.FC<{ handleSubmit: () => void }> = ({ handleSubmit }) => {
  const { emailInput, setEmailInput } = useOpenfort()

  const isValidEmail = useMemo(() => {
    return isValidEmailFn(emailInput)
  }, [emailInput])

  return (
    <ProvidersButtonStyle>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isValidEmail) handleSubmit()
        }}
        noValidate
      >
        <ProviderInputInner>
          <input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            type="email"
            placeholder="Enter your email"
            formNoValidate
          />
          <div style={{ position: 'relative' }}>
            <AnimatePresence initial={false}>
              {isValidEmail ? (
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -5, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  key={emailInput ? 'enabled' : 'disabled'}
                >
                  <EmailInnerButton type="submit" aria-label="Submit email">
                    <ProviderIcon>
                      <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <title>Submit email</title>
                        <line
                          stroke="currentColor"
                          x1="1"
                          y1="6"
                          x2="12"
                          y2="6"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                        <path
                          stroke="currentColor"
                          d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />
                      </svg>
                    </ProviderIcon>
                  </EmailInnerButton>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ x: 5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 5, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                >
                  <ProviderIcon>
                    <EmailIcon />
                  </ProviderIcon>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ProviderInputInner>
      </form>
    </ProvidersButtonStyle>
  )
}

const EmailPasswordButton: React.FC = () => {
  const { setRoute } = useOpenfort()
  const { user } = useOpenfortCore()

  const handleSubmit = () => {
    setRoute(user ? routes.LINK_EMAIL : routes.EMAIL_LOGIN)
  }

  return <EmailButton handleSubmit={handleSubmit} />
}

const EmailOTPButton: React.FC = () => {
  const { setRoute } = useOpenfort()

  const handleSubmit = () => {
    setRoute(routes.EMAIL_OTP)
  }

  return <EmailButton handleSubmit={handleSubmit} />
}

const PhoneButton: React.FC = () => {
  const { uiConfig, phoneInput, setPhoneInput, setRoute } = useOpenfort()

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    setRoute(routes.PHONE_OTP)
  }

  const hasValue = phoneInput.length > 5
  // && !defaultCountries.some((country: CountryData) => phoneInput.replace('+', '') === country[2])

  return (
    <ProvidersButtonStyle>
      <form onSubmit={handleSubmit} noValidate>
        <ProviderInputInner>
          <div style={{ width: '100%' }}>
            <PhoneInput
              value={phoneInput}
              onChange={(phone) => setPhoneInput(phone)}
              hideDropdown={false}
              placeholder="Enter your phone"
              style={
                {
                  '--react-international-phone-height': '56px',
                  '--react-international-phone-text-color': 'var(--ck-body-color)',
                  '--react-international-phone-background-color': 'var(--ck-secondary-button-background)',
                  '--react-international-phone-country-selector-background-color':
                    'var(--ck-secondary-button-background)',
                  '--react-international-phone-selected-dropdown-item-background-color':
                    'var(--ck-secondary-button-hover-background)',
                  '--react-international-phone-country-selector-background-color-hover':
                    'var(--ck-secondary-button-hover-background)',
                  '--react-international-phone-font-size': '16px',
                  paddingLeft: '4px',
                } as React.CSSProperties
              }
              {...uiConfig.phoneConfig}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <AnimatePresence initial={false}>
              {hasValue ? (
                <EmailInnerButton
                  initial={{ x: -5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -5, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  type="submit"
                  key={phoneInput ? 'enabled' : 'disabled'}
                  aria-label="Submit email"
                >
                  <ProviderIcon>
                    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Submit email</title>
                      <line stroke="currentColor" x1="1" y1="6" x2="12" y2="6" strokeWidth="1" strokeLinecap="round" />
                      <path
                        stroke="currentColor"
                        d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </svg>
                  </ProviderIcon>
                </EmailInnerButton>
              ) : (
                <motion.div
                  initial={{ x: 5, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 5, opacity: 0, position: 'absolute' }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                >
                  <ProviderIcon>
                    <PhoneIcon />
                  </ProviderIcon>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ProviderInputInner>
      </form>
    </ProvidersButtonStyle>
  )
}

const AuthProviderButton: React.FC<{ provider: OAuthProvider; title?: string; icon?: React.ReactNode }> = ({
  provider,
  title = `${provider} login`,
  icon,
}) => {
  const { setRoute, setConnector } = useOpenfort()

  const handleClick = () => {
    setRoute({ route: routes.CONNECT, connectType: 'linkIfUserConnectIfNoUser' })
    setConnector({ id: provider, type: 'oauth' })
  }

  return (
    <ProviderButtonBase onClick={handleClick} icon={icon}>
      {title}
    </ProviderButtonBase>
  )
}

const authProviderToOAuthProviderMap: Record<UIAuthProvider, React.ReactNode> = {
  guest: <GuestButton />,
  wallet: <WalletButton />,
  emailPassword: <EmailPasswordButton />,
  emailOtp: <EmailOTPButton />,
  phone: <PhoneButton />,
  google: (
    <AuthProviderButton provider={OAuthProvider.GOOGLE} title="Google" icon={providersLogos[UIAuthProvider.GOOGLE]} />
  ),
  twitter: (
    <AuthProviderButton provider={OAuthProvider.TWITTER} title="X" icon={providersLogos[UIAuthProvider.TWITTER]} />
  ),
  facebook: (
    <AuthProviderButton
      provider={OAuthProvider.FACEBOOK}
      title="Facebook"
      icon={providersLogos[UIAuthProvider.FACEBOOK]}
    />
  ),
  discord: (
    <AuthProviderButton
      provider={OAuthProvider.DISCORD}
      title="Discord"
      icon={providersLogos[UIAuthProvider.DISCORD]}
    />
  ),
  apple: (
    <AuthProviderButton provider={OAuthProvider.APPLE} title="Apple" icon={providersLogos[UIAuthProvider.APPLE]} />
  ),
}

export const ProviderButton: React.FC<{ provider: UIAuthProvider }> = ({ provider }) => {
  const { user } = useOpenfortCore()
  if (user && (provider === UIAuthProvider.EMAIL_OTP || provider === UIAuthProvider.EMAIL_PASSWORD)) {
    return <EmailPasswordButton />
  }
  return authProviderToOAuthProviderMap[provider] || null
}

// This accounts for the case where the user has an address but no user, which can happen if the user has not signed up yet, but logged in with a wallet
const AddressButNoUserCase: React.FC = () => {
  const { updateUser } = useOpenfortCore()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    updateUser()
      .then((user) => {
        if (!user) disconnect()
      })
      .catch(() => {
        logger.error('Failed to update user')
      })
  }, [])

  return (
    <PageContent>
      <Loader header="Updating user" />
    </PageContent>
  )
}

const SocialProvidersButton = ({ thereAreSocialsAlready }: { thereAreSocialsAlready: boolean }) => {
  const { setRoute } = useOpenfort()
  return (
    <ProviderButtonBase onClick={() => setRoute(routes.SOCIAL_PROVIDERS)} icon={<OtherSocials />}>
      {thereAreSocialsAlready ? 'Other socials' : 'Social providers'}
    </ProviderButtonBase>
  )
}

const Providers: React.FC = () => {
  const { user } = useOpenfortCore()
  const { address } = useAccount()
  const { previousRoute } = useOpenfort()
  const { mainProviders, hasExcessProviders } = useProviders()

  const onBack: SetOnBackFunction = useMemo(() => {
    if (user) {
      return 'back'
    }
    return null
  }, [previousRoute])

  if (address && !user) {
    return <AddressButNoUserCase />
  }

  return (
    <PageContent onBack={onBack}>
      <ModalHeading>{user ? 'Link auth' : 'Connect'}</ModalHeading>
      {mainProviders.map((auth) => (
        <ProviderButton key={auth} provider={auth} />
      ))}
      {hasExcessProviders && (
        <SocialProvidersButton thereAreSocialsAlready={!!mainProviders.find((p) => socialProviders.includes(p))} />
      )}
      <PoweredByFooter showDisclaimer={true} />
    </PageContent>
  )
}

export default Providers
