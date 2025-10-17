import type React from 'react'
import { useEffect, useState } from 'react'
import { EmailIcon } from '../../../assets/icons'
import { useOpenfortCore } from '../../../openfort/useOpenfort'
import { logger } from '../../../utils/logger'
import Button from '../../Common/Button'
import { TextLinkButton } from '../../Common/Button/styles'
import Loader from '../../Common/Loading'
import { ModalBody, ModalContent, ModalH1, PageContent } from '../../Common/Modal/styles'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'

// TODO: Localize
type VerificationResponse = {
  success: boolean
  error?: string
}

const EmailVerification: React.FC = () => {
  const { client } = useOpenfortCore()
  const { setRoute, log, emailInput: emailInStorage } = useOpenfort()

  const [loading, setLoading] = useState(true)
  const [shouldSendEmailVerification, setShouldSendEmailVerification] = useState<false | string>(false)
  const [verificationResponse, setVerificationResponse] = useState<VerificationResponse | null>(null)

  const sendEmailVerification = async (email: string) => {
    if (!email) {
      log('No linked account found')
      return
    }

    const redirectUrl = new URL(window.location.origin + window.location.pathname)
    redirectUrl.searchParams.append('openfortEmailVerificationUI', 'true')
    redirectUrl.searchParams.append('email', email)
    client.auth
      .requestEmailVerification({
        email,
        redirectUrl: redirectUrl.toString(),
      })
      .catch((e) => {
        log('Error requesting email verification', e)
      })
  }

  useEffect(() => {
    if (shouldSendEmailVerification) {
      sendEmailVerification(shouldSendEmailVerification)
    }
  }, [shouldSendEmailVerification, sendEmailVerification])

  useEffect(() => {
    const fixedUrl = window.location.href.replace('?state=', '&state=') // redirectUrl is not working with query params
    const url = new URL(fixedUrl)
    const openfortEmailVerificationUI = url.searchParams.get('openfortEmailVerificationUI')

    if (!openfortEmailVerificationUI) {
      // Send email verification flow
      if (!emailInStorage) {
        setRoute(routes.EMAIL_LOGIN)
        return
      }

      setShouldSendEmailVerification(emailInStorage)
      setLoading(false)
      return
    }

    // Verify email flow
    const state = url.searchParams.get('state')
    const email = url.searchParams.get('email')

    if (!state) {
      logger.error('No state found in URL')
      return
    }

    const removeParams = () => {
      ;['state', 'openfortEmailVerificationUI', 'email'].forEach((key) => url.searchParams.delete(key))
      window.history.replaceState({}, document.title, url.toString())
    }

    if (!email) {
      setRoute(routes.EMAIL_LOGIN)
      return
    }

    log('EmailVerification', state, email)
    ;(async () => {
      try {
        await client.auth.verifyEmail({
          email,
          state,
        })
        setVerificationResponse({
          success: true,
        })
      } catch (e) {
        setVerificationResponse({
          success: false,
          error: 'There was an error verifying your email. Please try again.',
        })
        log('Error verifying email', e)
      } finally {
        removeParams()
        setLoading(false)
      }
    })()
  }, [client.auth, emailInStorage, log, setRoute])

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
              {emailInStorage}
            </ModalBody>
            <TextLinkButton
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setRoute(routes.EMAIL_LOGIN)
              }}
            >
              Use another email
            </TextLinkButton>
          </>
        )}
      </ModalContent>
    </PageContent>
  )
}

export default EmailVerification
