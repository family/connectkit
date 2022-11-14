import React from 'react';
import { ButtonProps } from './types';
import {
  ButtonContainer,
  InnerContainer,
  IconContainer,
  Arrow,
  ArrowLine,
  ArrowChevron,
  DownloadArrow,
  DownloadArrowInner,
  SpinnerContainer,
  ButtonContainerInner,
} from './styles';
import { AnimatePresence } from 'framer-motion';
import { flattenChildren } from '../../../utils';
import FitText from '../FitText';

const transition = {
  duration: 0.4,
  ease: [0.175, 0.885, 0.32, 0.98],
};

const Spinner = () => (
  <SpinnerContainer
    initial={{ opacity: 0, rotate: 180 }}
    animate={{
      opacity: 1,
      rotate: 0,
    }}
    exit={{
      position: 'absolute',
      opacity: 0,
      rotate: -180,
      transition: {
        ...transition,
      },
    }}
    transition={{
      ...transition,
      delay: 0.2,
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeOpacity="0.1"
        strokeWidth="2.5"
      />
      <path
        d="M16 9C16 5.13401 12.866 2 9 2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  </SpinnerContainer>
);

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary', // unique aspect to how we're handling buttons
  disabled,
  icon,
  iconPosition = 'left',
  roundedIcon,
  waiting,
  arrow,
  download,
  href,
  style,
  onClick,
}) => {
  const key =
    typeof children === 'string'
      ? children
      : flattenChildren(children).join(''); // Need to generate a string for the key so we can automatically animate between content

  const hrefUrl =
    typeof href === 'string' ? href : flattenChildren(href).join(''); // Need to have a flat string for the href

  return (
    <ButtonContainer
      as={href ? 'a' : undefined}
      onClick={(event: any) => {
        if (!disabled && onClick) onClick(event);
      }}
      href={hrefUrl}
      target={href && '_blank'}
      rel={href && 'noopener noreferrer'}
      disabled={disabled}
      $variant={variant}
      style={style}
    >
      <AnimatePresence initial={false}>
        <ButtonContainerInner
          key={key}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: 1,
            y: -1,
          }}
          exit={{
            position: 'absolute',
            opacity: 0,
            y: 10,
            transition: {
              ...transition,
            },
          }}
          transition={{
            ...transition,
            delay: 0.2,
          }}
        >
          {icon && iconPosition === 'left' && (
            <IconContainer $rounded={roundedIcon}>{icon}</IconContainer>
          )}
          {download && (
            <DownloadArrow>
              <DownloadArrowInner>
                <Arrow
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ArrowLine
                    stroke="currentColor"
                    x1="1"
                    y1="6"
                    x2="12"
                    y2="6"
                    strokeWidth="var(--stroke-width)"
                    strokeLinecap="round"
                  />
                  <ArrowChevron
                    stroke="currentColor"
                    d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                    strokeWidth="var(--stroke-width)"
                    strokeLinecap="round"
                  />
                </Arrow>
              </DownloadArrowInner>
            </DownloadArrow>
          )}
          <InnerContainer>
            <FitText>{children}</FitText>
          </InnerContainer>
          {icon && iconPosition === 'right' && (
            <IconContainer $rounded={roundedIcon}>{icon}</IconContainer>
          )}
          {arrow && (
            <Arrow
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ArrowLine
                stroke="currentColor"
                x1="1"
                y1="6"
                x2="12"
                y2="6"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <ArrowChevron
                stroke="currentColor"
                d="M7.51431 1.5L11.757 5.74264M7.5 10.4858L11.7426 6.24314"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Arrow>
          )}
        </ButtonContainerInner>
        {waiting && <Spinner />}
      </AnimatePresence>
    </ButtonContainer>
  );
};
export default Button;
