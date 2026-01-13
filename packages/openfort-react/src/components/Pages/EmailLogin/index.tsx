import { AnimatePresence, motion, type Variants } from 'framer-motion'
import React, { useMemo } from 'react'
import { useEmailAuth } from '../../../hooks/openfort/auth/useEmailAuth'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import { TextLinkButton } from '../../Common/Button/styles'
import FitText from '../../Common/FitText'
import Input from '../../Common/Input'
import { ModalBody } from '../../Common/Modal/styles'
import { TextContainer } from '../../ConnectButton/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent, type SetOnBackFunction } from '../../PageContent'
import { FooterContainer } from './styles'

// TODO: Localize

const textVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transition: {
      duration: 0,
    },
  },
}

const EmailLogin: React.FC = () => {
  const [password, setPassword] = React.useState('')
  const { setRoute, triggerResize, setEmailInput: setEmail, emailInput: email, previousRoute } = useOpenfort()
  const [isRegister, setIsRegister] = React.useState(false)

  const {
    signUpEmail,
    signInEmail,
    error: loginError,
    isLoading: loginLoading,
  } = useEmailAuth({
    recoverWalletAutomatically: false,
  })

  const handleSubmit = async () => {
    if (isRegister) {
      return handleSignUp()
    }

    setIsRegister(false)
    setTimeout(() => {
      triggerResize()
    })
    const { error, requiresEmailVerification } = await signInEmail({
      email,
      password,
    })

    logger.log('SIGN IN RESPONSE', { error, requiresEmailVerification })

    if (!error) {
      if (requiresEmailVerification) {
        setRoute(routes.EMAIL_VERIFICATION)
      } else {
        setRoute(routes.LOAD_WALLETS)
      }
    } else {
      setTimeout(() => {
        triggerResize()
      }, 100)
    }
  }

  const handleSignUp = async () => {
    setIsRegister(true)
    setTimeout(() => {
      triggerResize()
    })
    const { error, requiresEmailVerification } = await signUpEmail({
      email,
      password,
    })

    logger.log('SIGN UP RESPONSE', { error, requiresEmailVerification })
    if (!error) {
      if (requiresEmailVerification) {
        setRoute(routes.EMAIL_VERIFICATION)
      } else {
        setEmail('')
        setRoute(routes.LOAD_WALLETS)
      }
    } else {
      setTimeout(() => {
        triggerResize()
      }, 100)
    }
  }

  const handleToggle = () => {
    setIsRegister((prev) => !prev)
  }

  const errorMessage = loginError
    ? loginError.message === 'Unauthorized'
      ? 'Invalid email or password'
      : loginError.message
    : null

  const onBack = useMemo<SetOnBackFunction>(() => {
    if (previousRoute?.route === routes.EMAIL_VERIFICATION) return routes.PROVIDERS
    return 'back'
  }, [previousRoute])

  return (
    <PageContent onBack={onBack}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        <Input
          style={{ marginTop: 0 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          disabled={loginLoading}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          disabled={loginLoading}
          autoFocus
        />

        <ModalBody style={{ marginTop: 12 }} $error={!!loginError}>
          <AnimatePresence initial={false}>
            <motion.div
              key={loginError ? 'error' : 'no-error'}
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              variants={textVariants}
            >
              <FitText maxFontSize={80} key={loginError ? 'text-error' : 'text-no-error'}>
                <span style={{ textAlign: 'center', color: 'var(--color-error)', marginRight: '4px' }}>
                  {errorMessage}
                </span>
              </FitText>
              <FitText maxFontSize={80}>
                <TextLinkButton
                  type="button"
                  onClick={() => {
                    setRoute(routes.FORGOT_PASSWORD)
                  }}
                >
                  Forgot password?
                </TextLinkButton>
              </FitText>
            </motion.div>
          </AnimatePresence>
        </ModalBody>
        <Button onClick={handleSubmit} disabled={loginLoading} waiting={loginLoading}>
          <AnimatePresence initial={false}>
            {loginLoading ? (
              <TextContainer
                key="connectedText"
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={textVariants}
              >
                {isRegister ? 'Signing up...' : 'Logging in...'}
              </TextContainer>
            ) : isRegister ? (
              <TextContainer
                key="connectedText"
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={textVariants}
              >
                Sign up
              </TextContainer>
            ) : (
              <TextContainer
                key="connectedText"
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={textVariants}
              >
                Sign in
              </TextContainer>
            )}
          </AnimatePresence>
        </Button>
      </form>
      <FooterContainer>
        or
        <button type="button" onClick={handleToggle} disabled={loginLoading}>
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
      </FooterContainer>
    </PageContent>
  )
}

export default EmailLogin
