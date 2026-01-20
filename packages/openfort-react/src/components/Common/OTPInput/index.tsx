import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { TickIcon } from '../../../assets/icons'
import {
  CaretBar,
  FakeCaretWrapper,
  OTPGroup,
  OTPHiddenInput,
  OTPNumberValue,
  OTPSlotWrapper,
  OtpContainer,
  SuccessTickWrapper,
} from './styles'

function FakeCaret() {
  return (
    <FakeCaretWrapper>
      <CaretBar />
    </FakeCaretWrapper>
  )
}

export function OtpInputStandalone({
  length = 6,
  onChange,
  onComplete,
  isLoading,
  isError,
  isSuccess,
  scale,
}: {
  length?: number
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  isLoading?: boolean
  isError?: boolean
  isSuccess?: boolean
  scale?: string
}) {
  const [values, setValues] = useState(Array(length).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)
  const canEdit = !isLoading && !isError && !isSuccess

  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleInput = (index: number, char: string) => {
    if (!char.match(/^[0-9]$/)) return
    if (!canEdit) return

    const newValues = [...values]
    newValues[index] = char
    setValues(newValues)
    onChange?.(newValues.join(''))

    // Move cursor to next box
    if (index < length - 1) {
      setActiveIndex(index + 1)
      inputsRef.current[index + 1]?.focus()
    }
  }

  useEffect(() => {
    if (values.every((v) => v !== '')) {
      onComplete?.(values.join(''))
    }
  }, [values])

  const handleBackspace = (index: number) => {
    const newValues = [...values]

    if (newValues[index] === '') {
      if (index > 0) {
        // Move back
        setActiveIndex(index - 1)
        inputsRef.current[index - 1]?.focus()
      }

      newValues[index - 1] = ''
    } else {
      newValues[index] = ''
    }
    setValues(newValues)
    onChange?.(newValues.join(''))
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return

    const arr = pasted.substring(0, length).split('')
    const newValues = [...values]

    arr.forEach((char, i) => {
      newValues[i] = char
    })

    setValues(newValues)
    onChange?.(newValues.join(''))

    const finalIndex = Math.min(arr.length - 1, length - 1)
    setActiveIndex(finalIndex)
    inputsRef.current[finalIndex]?.focus()
  }

  const handleFocus = (i: number) => {
    if (activeIndex !== -1) {
      setActiveIndex(i)
      return
    }
    const firstEmptyIndex = values.indexOf('')

    if (firstEmptyIndex !== -1) {
      setActiveIndex(firstEmptyIndex)
      inputsRef.current[firstEmptyIndex]?.focus()
    } else {
      setActiveIndex(length - 1)
      inputsRef.current[length - 1]?.focus()
    }
  }

  useEffect(() => {
    if (!isError) {
      setValues(Array(length).fill(''))
      setActiveIndex(0)
      inputsRef.current[0]?.focus()
    }
  }, [isError])

  return (
    <OtpContainer showBorder={!isSuccess} scale={scale}>
      <OTPGroup isError={isError} isSuccess={isSuccess} isLoading={isLoading}>
        {values.slice(0, length).map((value, idx) => {
          const index = idx

          return (
            <OTPSlotWrapper key={index} isActive={canEdit && activeIndex === index}>
              <OTPHiddenInput
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                value=""
                inputMode="numeric"
                onBlur={() => setActiveIndex(-1)}
                autoComplete="one-time-code"
                autoFocus={index === 0}
                onFocus={() => handleFocus(index)}
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (!canEdit) return
                  if (e.key === 'Backspace') {
                    e.preventDefault()
                    handleBackspace(index)
                  }
                }}
                onChange={(e) => handleInput(index, e.target.value)}
              />

              {value && <OTPNumberValue $hide={isSuccess}>{value}</OTPNumberValue>}
              {!value && activeIndex === index && <FakeCaret />}
            </OTPSlotWrapper>
          )
        })}
        {isSuccess && (
          <SuccessTickWrapper>
            <TickIcon width={'100%'} height={'100%'} />
          </SuccessTickWrapper>
        )}
      </OTPGroup>
    </OtpContainer>
  )
}
