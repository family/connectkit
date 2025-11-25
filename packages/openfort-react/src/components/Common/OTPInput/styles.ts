import styled, { css, keyframes } from 'styled-components'

const caretBlink = keyframes`
  0%, 70%, 100% { opacity: 1; }
  20%, 50% { opacity: 0; }
`
export const OtpContainer = styled.div<{ showBorder: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  --border: ${({ showBorder }) => (showBorder ? 'var(--ck-body-color-muted)' : 'transparent')};
`

const pulse = keyframes`
  0% {
    opacity: 100%;
  }
  50% {
    opacity: 40%;
  }
  100% {
    opacity: 100%;
  }
`

const dist = 2
const shakeKeyframes = keyframes`
  0%{ transform:none; }
  25%{ transform:translateX(${dist}px); }
  50%{ transform:translateX(-${dist}px); }
  75%{ transform:translateX(${dist}px); }
  100%{ transform:none; }
`

const keyframeSuccess = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`

export const OTPGroup = styled.div<{
  isError?: boolean
  isSuccess?: boolean
  isLoading?: boolean
}>`
  display: flex;

  outline-width: 3px;
  outline-style: solid;
  border-radius: 0.375rem;
  transition: outline-color 0.3s, border-radius .5s;

  outline-color: ${({ isError, isSuccess }) => {
    if (isError) return 'var(--ck-body-color-danger)'
    if (isSuccess) return 'var(--ck-body-color-valid)'
    return 'transparent'
  }};

  ${({ isLoading }) =>
    isLoading &&
    css`
      animation: ${pulse} 1s ease-in-out infinite;
    `}

  ${({ isError }) =>
    isError &&
    css`
      animation: ${shakeKeyframes} 220ms ease-out both;
    `}

  ${({ isSuccess }) =>
    isSuccess &&
    css`
      border-radius: 3rem;
      min-width: 3.5rem;
      ${OTPSlotWrapper} {
        width: 0;
        border: 0;
        transition: width .5s, border .5s;
      }
      animation: ${keyframeSuccess} 220ms ease-out both;
      animation-delay: 250ms;
    `}
`
export const OTPSlotWrapper = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 2.5rem;
  height: 3.5rem;     
  font-size: 2rem;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.3s;

  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  border-right: 0.5px solid var(--border);
  border-left: 0.5px solid var(--border);

  &:first-child {
    border-left: 1px solid var(--border);
    border-radius: 0.375rem 0 0 0.375rem;
  }

  &:last-child {
    border-radius: 0 0.375rem 0.375rem 0;
  }

  outline: ${({ isActive }) => (isActive ? '2px solid var(--ck-connectbutton-color)' : '0')};
  z-index: ${({ isActive }) => (isActive ? 1 : 0)};
  outline-offset: 0;

  cursor: text;
  color: var(--ck-body-color);
`

export const OTPNumberValue = styled.div<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => ($hide ? 0 : 1)};
  transition: opacity 0.3s;
`

export const OTPHiddenInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: text;
  caret-color: transparent; /* Hide native caret */
`

export const FakeCaretWrapper = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${caretBlink} 1.2s ease-out infinite;
`

export const CaretBar = styled.div`
  width: 1px;
  height: 2rem;
  background: var(--ck-body-color);
`

const keyframeWrapper = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`

export const SuccessTickWrapper = styled.div`
  position: absolute;
  inset: 5px;
  display: flex;
  animation: ${keyframeWrapper} 200ms ease-out both;
  animation-delay: 200ms;
  color: var(--ck-body-color-valid);
`
