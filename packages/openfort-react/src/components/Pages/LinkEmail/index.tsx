import { AnimatePresence, type Variants } from 'framer-motion'
import React from 'react'
import { useEmailAuth } from '../../../hooks/openfort/auth/useEmailAuth'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import FitText from '../../Common/FitText'
import Input from '../../Common/Input'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { TextContainer } from '../../ConnectButton/styles'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

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
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
}

const LinkEmail: React.FC = () => {
  // const [password, setPassword] = React.useState('')

  const { setRoute, triggerResize, emailInput: email, setEmailInput: setEmail } = useOpenfort()
  const { client, updateUser } = useOpenfortCore()

  const [loginLoading, setLoginLoading] = React.useState(false)
  const [loginError, setLoginError] = React.useState<false | string>(false)
  const { linkEmail } = useEmailAuth()

  const handleSubmit = async () => {
    setLoginLoading(true)

    await client.validateAndRefreshToken()
    try {
      await linkEmail({
        email,
        // emailVerificationRedirectTo: window.location.origin,
      })

      await updateUser()

      setEmail('')
      setRoute(routes.CONNECTED)
    } catch (e) {
      logger.log('Link error:', e)
      if (e instanceof Error) {
        setLoginError(e.message)
      } else {
        setLoginError('Could not link email.')
      }
      setLoginLoading(false)
      triggerResize()
    }
  }

  return (
    <PageContent>
      <ModalHeading>Link your email</ModalHeading>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <Input
          style={{ marginTop: 0 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          disabled={loginLoading}
        />
        {/* <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          disabled={loginLoading}
        /> */}

        {loginError && (
          <ModalBody style={{ height: 24, marginTop: 12 }} $error>
            <FitText>{loginError}</FitText>
          </ModalBody>
        )}

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
                Linking email...
              </TextContainer>
            ) : (
              <TextContainer
                key="connectedText"
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={textVariants}
              >
                Link email
              </TextContainer>
            )}
          </AnimatePresence>
        </Button>
      </form>
    </PageContent>
  )
}

export default LinkEmail
