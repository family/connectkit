import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { css, keyframes } from 'styled-components'
import { RetryIconCircle, TickIcon } from '../../../assets/icons'
import Logos from '../../../assets/logos'
import useLocales from '../../../hooks/useLocales'
import styled from '../../../styles/styled'
import { RetryButton, RetryIconContainer } from '../../ConnectModal/ConnectWithInjector/styles'
import { useOpenfort } from '../../Openfort/useOpenfort'
import { ModalBody, ModalContent, ModalH1 } from '../Modal/styles'
import SquircleSpinner from '../SquircleSpinner'
import Tooltip from '../Tooltip'

const LoadingTextWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  padding: 0 8px 16px;
  text-align: center;
`

const ConnectingContainer = styled(motion.div)`
display: flex;
align-items: center;
justify-content: center;
margin: 10px auto 16px;
height: 120px;
`

const dist = 2
const shakeKeyframes = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`
const outlineKeyframes = keyframes`
  0%{ opacity:0; }
  100%{ opacity:1; }
`
const ConnectingAnimation = styled(motion.div)<{
  $color: string | undefined
  $shake: boolean
}>`
  position: relative;
  user-select: none;
  position: relative;
  --spinner-error-opacity: 0;
  &:before {
    content: '';
    position: absolute;
    inset: 1px;
    opacity: 0;
    background: ${(props) => props.$color};
  }
  ${(props) =>
    !!props.$color &&
    css`
    &:before {
      opacity: 1;
    }
  `}
  ${(props) =>
    props.$shake &&
    css`
      animation: ${shakeKeyframes} 220ms ease-out both;
      &:before {
        animation: ${outlineKeyframes} 220ms ease-out both;
      }
    `}
`

type LoaderProps = {
  header: string
  description?: string | undefined
  isLoading?: boolean
  icon?: React.ReactNode
  isError?: boolean
  isSuccess?: boolean
  onRetry?: () => void
}

const Loader = ({
  header,
  description,
  icon,
  isError = false,
  isSuccess = false,
  isLoading = !isError && !isSuccess,
  onRetry,
}: LoaderProps) => {
  const { uiConfig: options } = useOpenfort()
  const { triggerResize } = useOpenfort()
  const locales = useLocales()

  useEffect(() => {
    return () => triggerResize()
  }, [])

  const renderLogo = () => {
    if (icon) {
      return icon
    }
    if (options?.logo) {
      if (typeof options.logo === 'string') {
        return <img src={options.logo} alt="Logo" style={{ width: '100%' }} />
      }
      return options.logo
    }
    return <Logos.Openfort />
  }

  return (
    <>
      <ConnectingContainer>
        <ConnectingAnimation
          $color={isSuccess ? 'var(--ck-body-color-valid)' : isError ? 'var(--ck-body-color-danger)' : undefined}
          $shake={isError}
        >
          <AnimatePresence>
            {isError && onRetry && (
              <RetryButton
                aria-label="Retry"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={onRetry}
              >
                <RetryIconContainer>
                  <Tooltip open={isError} message={locales.tryAgainQuestion} xOffset={-6}>
                    <RetryIconCircle />
                  </Tooltip>
                </RetryIconContainer>
              </RetryButton>
            )}
          </AnimatePresence>

          <SquircleSpinner
            logo={
              <div
                style={{
                  padding: '12px',
                  position: 'relative',
                  width: '100%',
                }}
              >
                {renderLogo()}
              </div>
            }
            connecting={isLoading}
          />
        </ConnectingAnimation>
      </ConnectingContainer>
      <LoadingTextWrapper>
        {isLoading && (
          <>
            <ModalH1>Loading, please wait</ModalH1>
            <ModalBody>{description ?? header}</ModalBody>
          </>
        )}
        {isSuccess && (
          <>
            <ModalH1 $valid>
              <TickIcon /> {header}
            </ModalH1>
            <ModalBody>{description}</ModalBody>
          </>
        )}

        {isError && (
          <>
            <ModalH1 $error>{header}</ModalH1>
            <ModalBody>{description}</ModalBody>
          </>
        )}
      </LoadingTextWrapper>
    </>
  )
}

export default Loader
