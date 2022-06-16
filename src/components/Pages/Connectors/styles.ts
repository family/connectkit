import styled from 'styled-components';
import { motion } from 'framer-motion';

export const InfoBox = styled.div`
  margin: -9px auto 32px;
  border-radius: 16px;
  text-align: center;
  padding: 20px 28px 16px;
  box-shadow: 0 0 0 1px var(--body-divider);
`;
export const LearnMoreContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: -6px;
`;
export const LearnMoreButton = styled(motion.button)`
  appearance: none;
  user-select: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 42px;
  padding: 0 16px;
  border-radius: 6px;
  background: none;
  color: var(--body-color-muted);
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
  will-change: transform;
  transition: color 200ms ease, transform 100ms ease;
  svg {
    display: block;
    position: relative;
    top: 1px;
    left: 1px;
    path,
    circle {
      transition: all 100ms ease-out;
    }
    path:last-of-type {
      transform-origin: 0 0;
      transform: scaleX(1.3) skewY(-12deg);
      opacity: 0;
    }
    circle {
      transform: translate(20%, -15%);
    }
  }
  &:hover {
    color: var(--body-color-muted-hover);
    svg {
      path,
      circle {
        opacity: 1;
        transform: none;
      }
    }
  }
  &:active {
    transform: scale(0.96);
  }
`;

export const ConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 0 16px;
`;

export const ConnectorButton = styled(motion.button)`
  cursor: pointer;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 24px;
  width: 100%;
  height: 64px;
  font-size: 17px;
  font-weight: 500;
  line-height: 20px;
  text-align: var(--body-button-text-align, left);
  transition: 180ms ease;
  transition-property: background, color, box-shadow, transform;
  will-change: transform, box-shadow, background-color, color;

  --fallback-color: var(--ck-primary-button-color);
  --fallback-background: var(--ck-primary-button-background);
  --fallback-box-shadow: var(--ck-primary-button-box-shadow);
  --fallback-border-radius: var(--ck-primary-button-border-radius);

  --color: var(--ck-primary-button-color);
  --background: var(--ck-primary-button-background);
  --box-shadow: var(--ck-primary-button-box-shadow);
  --border-radius: var(--ck-primary-button-border-radius);

  color: var(--color, var(--fallback-color));
  background: var(--background, var(--fallback-background));
  box-shadow: var(--box-shadow, var(--fallback-box-shadow));
  border-radius: var(--border-radius, var(--fallback-border-radius));

  &:disabled {
    transition: 0ms;
  }

  &:not(:disabled) {
    &:hover {
      --color: var(--ck-primary-button-hover-color);
      --background: var(--ck-primary-button-hover-background);
      --box-shadow: var(--ck-primary-button-hover-box-shadow);
      --border-radius: var(--ck-primary-button-hover-border-radius);
    }
    &:focus {
      transition-duration: 100ms;
      --color: var(--ck-primary-button-focus-color);
      --background: var(--ck-primary-button-focus-background);
      --box-shadow: var(--ck-primary-button-focus-box-shadow);
      --border-radius: var(--ck-primary-button-focus-border-radius);
    }
    &:active {
      --color: var(--ck-primary-button-active-color);
      --background: var(--ck-primary-button-active-background);
      --box-shadow: var(--ck-primary-button-active-box-shadow);
      --border-radius: var(--ck-primary-button-active-border-radius);
    }
  }
`;

export const ConnectorLabel = styled(motion.span)`
  width: 100%;
  padding: var(--body-connector-label-padding, '0 64px');
`;

export const ConnectorIcon = styled(motion.div)`
  position: absolute;
  left: var(--body-connector-icon-left, auto);
  right: var(--body-connector-icon-right, 16px);
  width: 32px;
  height: 32px;
  overflow: hidden;
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;
export const MobileConnectorsContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  padding: 0 24px 16px;
  margin: 0 -24px;
`;

export const MobileConnectorButton = styled(motion.button)`
  --background: var(--body-background-secondary);
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 0;
  width: 100%;
  min-width: 25%;
  font-size: 13px;
  font-weight: 500;
  line-height: 13px;
  border-radius: var(--body-button-border-radius, 18px);
  color: var(--body-color);
  text-align: center;
  transition: transform 100ms ease;
  border: var(--body-button-border);

  background: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &:not(:disabled) {
    &:active {
      transform: scale(0.97);
    }
  }
`;

export const MobileConnectorLabel = styled(motion.span)`
  display: block;
  padding: 10px 0 0;
`;

export const MobileConnectorIcon = styled(motion.div)`
  margin: 0 auto;
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 16px;
  svg {
    border-radius: inherit;
    display: block;
    position: relative;
    transform: translate3d(0, 0, 0);
    width: 100%;
    height: 100%;
  }
`;
