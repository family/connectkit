import { css } from 'styled-components';
import styled from './../../../styles/styled';
import { motion } from 'framer-motion';

import { CopyToClipboardIcon as Icon } from '../../../assets/icons';

const IconContainer = styled(motion.div)<{ $clipboard?: boolean }>`
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  svg {
    display: block;
  }
  svg,
  svg path,
  svg rect {
    transition: inherit;
  }
  svg path:first-child {
    transform-origin: 50% 50%;
    fill: var(--bg);
    stroke: var(--color);
  }
  svg rect {
    transform-origin: 53% 63%;
    fill: var(--bg);
    stroke: var(--color);
  }
  svg path:last-child {
    opacity: 0;
    stroke: var(--bg);
    transform: translate(11.75px, 10px) rotate(90deg) scale(0.6);
  }
  ${(props) =>
    props.$clipboard
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
`;

const CopyToClipboardIcon = ({
  copied,
  small,
}: {
  copied?: boolean;
  small?: boolean;
}) => (
  <IconContainer $clipboard={copied}>
    <Icon
      style={{
        transform: small ? 'scale(1)' : 'translateX(3px) scale(1.5)',
        opacity: small || copied ? 1 : 0.3,
      }}
    />
  </IconContainer>
);
export default CopyToClipboardIcon;
