import React, { useState } from 'react';
import styled from './../../../styles/styled';
import { css } from 'styled-components';

import CopyToClipboardIcon from './CopyToClipboardIcon';
import Button from '../Button';

const Container = styled.div<{ $disabled?: boolean }>`
  --color: var(--ck-copytoclipboard-stroke);
  --bg: var(--ck-body-background);
  transition: all 220ms cubic-bezier(0.175, 0.885, 0.32, 1.1);

  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.$disabled
      ? css`
          cursor: not-allowed;
          opacity: 0.4;
        `
      : css`
          &:hover {
            --color: var(--ck-body-color-muted);
          }
        `}
`;
const OffsetContainer = styled.div`
  display: block;
  position: relative;
  transition: inherit;
  svg {
    position: absolute;
    left: 100%;
    display: block;
    top: -1px;
    margin: 0;
    margin-left: 4px;
  }
`;

const CopyToClipboard: React.FC<{
  string?: string;
  children?: React.ReactNode;
  variant?: 'button';
}> = ({ string, children, variant }) => {
  const [clipboard, setClipboard] = useState(false);

  let timeout: any;
  const onCopy = () => {
    if (!string) return;
    const str = string.trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(str);
    } else {
      // Fallback copy to clipboard if necessary
      /*
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      */
    }
    setClipboard(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => setClipboard(false), 1000);
  };

  if (variant === 'button')
    return (
      <Button
        disabled={!string}
        onClick={onCopy}
        icon={<CopyToClipboardIcon copied={clipboard} />}
      >
        {children}
      </Button>
    );

  return (
    <Container onClick={onCopy} $disabled={!string}>
      <OffsetContainer>
        {children}
        <CopyToClipboardIcon copied={clipboard} small />
      </OffsetContainer>
    </Container>
  );
};

export default CopyToClipboard;
