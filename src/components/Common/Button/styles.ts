import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import defaultTheme from '../../../constants/defaultTheme';

export const Arrow = styled.svg`
  --x: -3px;
  --stroke-width: 2;
  position: relative;
  top: 0px;
  left: -0.5px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 9px;
  margin-right: 1px;
  transition: all 100ms ease;
  transform: translateX(var(--x, -3px));
  color: var(--ck-secondary-button-color, var(--body-color));
  opacity: 0.4;
`;
export const ArrowChevron = styled.path``;
export const ArrowLine = styled.line`
  transition: inherit;
  transition-property: transform;
  transform-origin: 90% 50%;
  transform: scaleX(0.1);
`;
export const DownloadArrow = styled.div`
  display: inline-block;
  vertical-align: middle;
  position: relative;
  margin-right: 6px;
  color: var(--ck-secondary-button-color, var(--body-color));
`;
export const DownloadArrowInner = styled.div`
  transform: rotate(90deg);
  ${Arrow} {
    margin: 0 auto;
  }
`;

export const ButtonContainer = styled.button<{ disabled?: boolean }>`
--color: var(--button-primary-color, var(--body-color));
--background: var(--ck-secondary-button-background, var(--body-background-secondary));
--box-shadow: var(--ck-secondary-button-box-shadow);
--border-radius: var(--ck-secondary-button-border-radius);
--font-weight: var(--ck-secondary-button-font-weight, 500);

--hover-color: var(--button-primary-hover-color, var(--color));
--hover-background: var(--ck-secondary-button-hover-background, var(--background));
--hover-box-shadow: var(--ck-secondary-button-hover-box-shadow, var(--box-shadow));
--hover-border-radius: var(--ck-secondary-button-hover-border-radius, var(--border-radius));
--hover-font-weight: var(--ck-secondary-button-font-weight, var(--font-weight));

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
  font-weight: var(--font-weight,500);
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;

  color: var(--color);
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);

  ${DownloadArrow} {
    ${Arrow} {
      transform: translateX(0);
      ${ArrowLine} {
        transform: none;
      }
      ${ArrowChevron} {
      }
    }
  }
}

  @media only screen and (min-width: ${defaultTheme.mobileWidth + 1}px) {
    &:hover,
    &:focus {
      color: var(--ck-accent-text-color, var(--hover-color));
      background: var(--ck-accent-color, var(--hover-background));
      border-radius: var(--hover-border-radius);
      box-shadow: var(--hover-box-shadow);

      ${Arrow} {
        transform: translateX(0);
        ${ArrowLine} {
          transform: none;
        }
        ${ArrowChevron} {
        }
      }
      ${DownloadArrow} {
        ${Arrow} {
          transform: translateX(var(--x));
          ${ArrowLine} {
            transform: scaleX(0.1);
          }
          ${ArrowChevron} {
          }
        }
      }
    }
    &:active {
      box-shadow: var(--ck-secondary-button-active-box-shadow, var(--hover-box-shadow));
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
