import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

export const Arrow = styled.svg`
  position: relative;
  top: 0px;
  left: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(-3px);
  color: var(--ck-secondary-button-color, var(--body-color));
  opacity: 0.4;
  --stroke-width: 2;
`;
export const ArrowChevron = styled.path``;
export const ArrowLine = styled.line`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;
export const CircleArrow = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-left: 1px;
  margin-right: 9px;
  border-radius: 50%;
  color: var(--ck-secondary-button-color, var(--body-color));
  box-shadow: inset 0 0 0 2px currentColor;
  opacity: 0.4;
  width: 18px;
  height: 18px;
`;
export const CircleArrowInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  transform: rotate(90deg) scale(0.75);
  ${Arrow} {
    left: 0.5px;
    margin: 0 auto;
    opacity: 1;
    --stroke-width: 2.5;
  }
`;

export const ButtonContainer = styled.button<{ disabled?: boolean }>`
  --color: var(--button-primary-color, var(--body-color));
  --background: var(
    --ck-secondary-button-background,
    var(--body-background-secondary)
  );
  --box-shadow: var(
    --ck-secondary-button-box-shadow,
    --button-primary-box-shadow,
    none
  );
  --border: var(--ck-secondary-button-border);
  --border-radius: var(--ck-secondary-button-border-radius, 16px);

  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 48px;
  margin: 12px 0 0;
  line-height: 48px;
  padding: 0 4px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;

  color: var(--color);
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: var(--border);

  @media only screen and (min-width: ${defaultTheme.mobileWidth + 1}px) {
    &:hover {
      color: var(--ck-accent-text-color);
      --background: var(
        --ck-accent-color,
        var(--body-background-secondary-hover)
      );
      /* border-color: transparent; */
      box-shadow: var(--ck-secondary-button-hover-box-shadow);
      ${Arrow} {
        transform: translateX(0);
        ${ArrowLine} {
          transform: none;
        }
        ${ArrowChevron} {
        }
      }
    }
    &:active {
      box-shadow: 0 0 0 1px var(--background);
    }
  }
  @media only screen and (max-width: ${defaultTheme.mobileWidth}px) {
    transition: transform 100ms ease;
    transform: scale(1);
    font-size: 17px;
    &:active {
    }
  }
`;

export const InnerContainer = styled.span`
  display: inline-block;
  vertical-align: middle;
  transform: translateZ(0);
`;

export const IconContainer = styled(motion.div)<{ $rounded?: boolean }>`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 20px;
  max-height: 20px;
  margin-right: 10px;
  ${(props) => {
    return (
      props.$rounded &&
      css`
        overflow: hidden;
        border-radius: 5px;
      `
    );
  }}
  svg {
    display: block;
    position: relative;
    max-width: 100%;
    height: auto;
  }
`;
