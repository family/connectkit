import { motion } from 'framer-motion';
import styled from './../../../styles/styled';
import { css, keyframes } from 'styled-components';

type ChainContainerProps = {
  size?: number | string;
  radius?: number | string;
};

export const ChainContainer = styled.div<ChainContainerProps>`
  --bg: transparent;
  --color: #333;
  ${(props) =>
    typeof props.size === 'string'
      ? css`
          --width: ${props.size};
          --height: ${props.size};
        `
      : css`
          --width: ${props.size >= 0 ? `${props.size}px` : '24px'};
          --height: ${props.size >= 0 ? `${props.size}px` : '24px'};
        `};
  ${(props) =>
    typeof props.radius === 'string'
      ? css`
          --radius: ${props.radius};
        `
      : css`
          --radius: ${props.radius >= 0 ? `${props.radius}px` : '24px'};
        `};
  display: block;
  position: relative;
  width: var(--width);
  height: var(--height);
  min-width: var(--width);
  min-height: var(--height);
  border-radius: var(--radius);
  background: var(--ck-body-background-secondary);
  pointer-events: none;
  user-select: none;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const LogoContainer = styled(motion.div)`
  display: block;
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Spin = keyframes`
  0%{ transform: rotate(0deg); }
  100%{ transform: rotate(360deg); }
`;
export const LoadingContainer = styled(motion.div)`
  position: absolute;
  inset: 0;
  animation: ${Spin} 1s linear infinite;
  svg {
    display: block;
    position: absolute;
    inset: 0;
  }
`;

export const Unsupported = styled(motion.div)`
  z-index: 2;
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 40%;
  min-width: 13px;
  min-height: 13px;
  color: var(--ck-body-color-danger, red);
  svg {
    display: block;
    position: relative;
    top: -30%;
    right: -30%;
  }
`;
