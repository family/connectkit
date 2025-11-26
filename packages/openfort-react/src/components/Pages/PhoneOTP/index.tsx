import React, { useEffect, useMemo } from 'react'
import { PhoneIcon } from '../../../assets/icons'
import { logger } from '../../../utils/logger'
import { ModalBody, ModalHeading } from '../../Common/Modal/styles'
import { OtpInputStandalone } from '../../Common/OTPInput'
import PoweredByFooter from '../../Common/PoweredByFooter'
import { FloatingGraphic } from '../../FloatingGraphic'
import { routes } from '../../Openfort/types'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { PageContent, type SetOnBackFunction } from '../../PageContent'
import { Body, FooterButtonText, FooterTextButton, ResultContainer } from './styles'

// TODO: Localize

const PhoneOTP: React.FC = () => {
  const { phoneInput: phone, previousRoute, setPhoneInput, setRoute } = useOpenfort()

  const onBack = useMemo<SetOnBackFunction>(() => {
    if (previousRoute?.route === routes.EMAIL_VERIFICATION) return routes.PROVIDERS
    return 'back'
  }, [previousRoute])

  const [sendOTPRequested, setSendOTPRequested] = React.useState(false)
  const [status, setStatus] = React.useState<
    'idle' | 'error' | 'success' | 'loading' | 'send-otp' | 'sending-otp' | 'initial'
  >('initial')

  const handleComplete = (otp: string) => {
    logger.log('OTP entered:', otp)
    setStatus('loading')

    // TODO: Replace with real verification logic
    // ---- Simulate OTP verification ----
    setTimeout(() => {
      if (otp === '123456') {
        setStatus('success')
      } else {
        setStatus('error')
      }
    }, 1000)
    // ----------------------------------
  }

  useEffect(() => {
    if (status === 'initial') {
      // Simulate initial OTP send
      // console.log('Sending initial OTP to', email)
      setTimeout(() => {
        setStatus('idle')
      }, 1500)
    }
    if (status === 'send-otp') {
      // TODO: Trigger resend OTP logic here
      // console.log('Sending OTP to', email)
      setStatus('sending-otp')
      setTimeout(() => {
        setSendOTPRequested(true)
        setStatus('idle')
      }, 1500)
    }
    if (status === 'success') {
      setTimeout(() => {
        setPhoneInput('')
        // TODO: Replace with real next step
        setRoute(routes.CREATE_GUEST_USER)
      }, 2000)
    }
    if (status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const sendButtonText = () => {
    if (sendOTPRequested) return 'Code Sent!'
    if (status === 'sending-otp') return 'Sending...'
    if (status === 'send-otp') return 'Resend Code'
    return 'Resend Code'
  }

  useEffect(() => {
    if (sendOTPRequested) {
      const timer = setTimeout(() => {
        setSendOTPRequested(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [sendOTPRequested])

  return (
    <PageContent onBack={onBack}>
      <ModalHeading>Enter your code</ModalHeading>

      <FloatingGraphic
        height="100px"
        marginTop="8px"
        marginBottom="10px"
        logoCenter={{
          logo: <PhoneIcon />,
        }}
      />
      <ModalBody>
        <Body>
          Please check <b>{phone}</b> for an SMS and enter your code below.
        </Body>
        <OtpInputStandalone
          onComplete={handleComplete}
          isLoading={status === 'loading'}
          isError={status === 'error'}
          isSuccess={status === 'success'}
        />
        <ResultContainer>
          {status === 'success' && <ModalBody $valid>Code verified successfully!</ModalBody>}
          {status === 'error' && <ModalBody $error>Invalid code. Please try again.</ModalBody>}
        </ResultContainer>
        <FooterTextButton>
          Didn't receive the code?{' '}
          <FooterButtonText
            type="button"
            onClick={() => setStatus('send-otp')}
            disabled={sendOTPRequested || status === 'sending-otp' || status === 'send-otp'}
          >
            {sendButtonText()}
          </FooterButtonText>
        </FooterTextButton>
      </ModalBody>
      <PoweredByFooter />
    </PageContent>
  )
}

export default PhoneOTP
