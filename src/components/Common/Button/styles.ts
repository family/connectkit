import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { isMobile } from '../../../utils';

const mobile = isMobile();

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
  color: var(--body-color-muted);
`;
export const ArrowChevron = styled.path``;
export const ArrowLine = styled.line`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
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
  height: 48px;
  margin: 12px 0 0;
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

  /* Don't show hover/active styling on mobile */
  ${(props) => {
    if (!mobile) {
      return css`
        &:hover {
          color: var(--accent-text-color);
          --background: var(
            --accent-color,
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
      `;
    } else {
      return css`
        transition: transform 100ms ease;
        transform: scale(1);
        font-size: 17px;
        &:active {
          /* transform: scale(0.97); */
        }
      `;
    }
  }}
`;

export const IconContainer = styled(motion.div)<{ $rounded?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
