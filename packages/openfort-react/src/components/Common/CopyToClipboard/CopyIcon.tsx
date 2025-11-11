import { type MotionStyle, motion } from 'framer-motion'
import { css } from 'styled-components'
import { CopyToClipboardIcon as Icon } from '../../../assets/icons'
import styled from '../../../styles/styled'

const IconWrapper = styled(motion.div)<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: all 220ms ease;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg path:first-child {
    transition: all 220ms ease;
    fill: var(--bg, var(--ck-body-background));
    stroke: var(--color, var(--ck-copytoclipboard-stroke));
    transform-origin: 50% 50%;
  }

  svg rect {
    transition: all 220ms ease;
    fill: var(--bg, var(--ck-body-background));
    stroke: var(--color, var(--ck-copytoclipboard-stroke));
    transform-origin: 53% 63%;
  }

  svg path:last-child {
    transition: all 220ms ease;
    opacity: ${(props) => (props.$copied ? 1 : 0)};
    stroke: var(--ck-body-background);
    transform: translate(11.75px, 10px) rotate(90deg) scale(0.6);
  }

  ${(props) =>
    props.$copied
      ? css`
          --color: var(--ck-focus-color) !important;
          --bg: var(--ck-body-background);
          svg {
            transition-delay: 0ms;
            path:first-child {
              opacity: 0;
              transform: rotate(-90deg) scale(0.2);
            }
            rect {
              rx: 10px;
              fill: var(--color);
              transform: rotate(-90deg) scale(1.45);
            }
            path:last-child {
              transition-delay: 100ms;
              opacity: 1;
              transform: translate(7.75px, 9.5px);
            }
          }
        `
      : css`
          &:hover {
          }
          &:hover:active {
          }
        `}
`

interface CopyIconProps {
  copied?: boolean
  size?: MotionStyle['width']
  className?: string
}

export const CopyIcon = ({ copied, size = '1rem', className }: CopyIconProps) => {
  return (
    <IconWrapper $copied={copied} className={className} style={{ width: size, height: size }}>
      <Icon />
    </IconWrapper>
  )
}
