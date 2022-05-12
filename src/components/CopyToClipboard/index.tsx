import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

import { CopyToClipboardIcon } from '../../assets/icons';

export const CopyButton = styled(motion.div)<{ $clipboard?: boolean }>`
  --color: var(--copytoclipboard-stroke);
  --bg: var(--body-background);
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.1);

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  span {
    display: block;
    position: relative;
    transition: inherit;
  }

  &:hover {
    --color: var(--body-color-muted);
  }

  svg {
    position: absolute;
    left: 100%;
    display: block;
    top: 1px;
    margin: 0;
    margin-left: 4px;
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
          --color: var(--focus-color) !important;
          --bg: var(--body-background);
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

const CopyToClipboard: React.FC<{
  string: string | undefined;
  children?: React.ReactNode;
}> = ({ string, children }) => {
  const [clipboard, setClipboard] = useState(false);
  if (!string) return <></>;

  const str = string.trim();
  let timeout: any;
  return (
    <CopyButton
      aria-label="Copy to Clipboard"
      $clipboard={clipboard}
      onClick={() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => setClipboard(false), 1000);
        setClipboard(true);
        navigator.clipboard.writeText(str);
      }}
    >
      <span>
        {children}
        <CopyToClipboardIcon />
      </span>
    </CopyButton>
  );
};

export default CopyToClipboard;
