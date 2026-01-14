import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { EmailIcon } from '../../../assets/icons'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import { TextLinkButton } from '../../Common/Button/styles'
import Loader from '../../Common/Loading'
import { ModalBody, ModalContent, ModalH1 } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent } from '../../PageContent'

// TODO: Localize
type VerificationResponse = {
  success: boolean
  error?: string
}

const EmailVerification: React.FC = () => {
  const { setRoute, emailInput, setEmailInput } = useOpenfort()

  const [loading, setLoading] = useState(true)
  const [verificationResponse, setVerificationResponse] = useState<VerificationResponse | null>(null)

  const isVerifying = useRef(false)
  useEffect(() => {
    if (isVerifying.current) return
    isVerifying.current = true

    const url = new URL(window.location.href)

    if (emailInput) {
      // Not callback flow
      setLoading(false)
      return
    }

    // Verify email flow
    const email = url.searchParams.get('email')

    const removeParams = () => {
      ;['state', 'openfortEmailVerificationUI', 'email', 'openfortAuthProvider'].forEach((key) => {
        url.searchParams.delete(key)
      })
      window.history.replaceState({}, document.title, url.toString())
    }
    logger.log('Email verification', email)

    if (!email) {
      setRoute(routes.EMAIL_LOGIN)
      return
    }

    try {
      // ASSUMING IT WORKS
      // TODO: TMP FIX
      setEmailInput(email)
      setVerificationResponse({
        success: true,
      })
    } catch (e) {
      setVerificationResponse({
        success: false,
        error: 'There was an error verifying your email. Please try again.',
      })
      logger.log('Error verifying email', e)
    } finally {
      removeParams()
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <PageContent>
        <Loader header="Checking if account is verified" />
      </PageContent>
    )
  }

  return (
    <PageContent>
      <FloatingGraphic
        height="190px"
        logoCenter={{
          logo: <EmailIcon />,
        }}
        logoTopLeft={{
          logo: <EmailIcon />,
        }}
        logoBottomRight={{
          logo: <EmailIcon />,
        }}
        logoTopRight={{
          logo: <EmailIcon />,
        }}
        logoBottomLeft={{
          logo: <EmailIcon />,
        }}
      />
      <ModalContent>
        {verificationResponse ? (
          <>
            <ModalH1 $small>{verificationResponse.success ? 'Email verified' : 'Email verification failed'}</ModalH1>
            <ModalBody>
              {verificationResponse.error ? verificationResponse.error : 'Your email has been verified.'}
              <Button
                onClick={() => {
                  setRoute(routes.EMAIL_LOGIN)
                }}
                style={{ marginTop: 12 }}
              >
                Continue
              </Button>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalH1 $small>Email sent</ModalH1>
            <ModalBody style={{ height: 40 }}>
              Please check your email.
              <br />
              {emailInput}
            </ModalBody>
            <TextLinkButton
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setRoute(routes.EMAIL_LOGIN)
              }}
            >
              Go back to login
            </TextLinkButton>
          </>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default EmailVerification
