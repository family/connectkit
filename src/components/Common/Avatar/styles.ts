import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

function addressToNumber(address: string) {
  return (
    (address
      .split('')
      .map((l) => l.charCodeAt(0))
      .reduce((a, b) => a + b) %
      100) /
    100
  );
}

export const EnsAvatar = styled(motion.div)<{
  $seed?: string;
  $size?: number;
  $radius?: number;
}>`
  will-change: transform; // Needed for Safari
  pointer-events: none;
  user-select: none;
  position: relative;
  overflow: hidden;
  margin: 0;
  border-radius: ${(props) =>
    props.$radius !== undefined ? `${props.$radius}px` : '50%'};
  width: ${(props) => (props.$size ? props.$size : 96)}px;
  height: ${(props) => (props.$size ? props.$size : 96)}px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
  &:before {
    content: '';
    z-index: 1;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.02);
  }
  ${(props) => {
    if (props.$seed) {
      const ensColor = `0${Math.ceil(addressToNumber(props.$seed) * 8)}`;
      return css`
        background: var(--ck-ens-${ensColor}-start);
        background: linear-gradient(
          180deg,
          var(--ck-ens-${ensColor}-start) 0%,
          var(--ck-ens-${ensColor}-stop) 100%
        );
      `;
    }
  }}
`;

export const ImageContainer = styled(motion.img)<{ $loaded: boolean }>`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  will-change: opacity; // Needed for Safari
  transition: opacity 500ms ease;
  transform: scale(1.01); // fixes background color bleeding
`;
