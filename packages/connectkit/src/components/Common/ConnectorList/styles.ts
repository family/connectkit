import styled from '../../../styles/styled';
import { css, keyframes } from 'styled-components';

import { motion } from 'framer-motion';

const Shimmer = keyframes`
  0%{ transform: translate(-100%) rotate(-45deg); }
  100%{ transform: translate(100%) rotate(-80deg); }
`;

export const ConnectorButton = styled(motion.button)`
  display: block;
  text-decoration: none;
`;
export const ConnectorLabel = styled(motion.span)``;
export const ConnectorIcon = styled(motion.div)``;

// This is a bit of a hack to not share styles between mobile and desktop
const styles = {
  desktop: {
    ConnectorButton: css`
      cursor: pointer;
      user-select: none;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 20px;
      width: 100%;
      height: 64px;
      font-size: 17px;
      font-weight: var(--ck-primary-button-font-weight, 500);
      line-height: 20px;
      text-align: var(--ck-body-button-text-align, left);
      transition: 180ms ease;
      transition-property: background, color, box-shadow, transform, opacity;
      will-change: transform, box-shadow, background-color, color, opacity;

      --fallback-color: var(--ck-primary-button-color);
      --fallback-background: var(--ck-primary-button-background);
      --fallback-box-shadow: var(--ck-primary-button-box-shadow);
      --fallback-border-radius: var(--ck-primary-button-border-radius);

      --color: var(--ck-primary-button-color, var(--fallback-color));
      --background: var(
        --ck-primary-button-background,
        var(--fallback-background)
      );
      --box-shadow: var(
        --ck-primary-button-box-shadow,
        var(--fallback-box-shadow)
      );
      --border-radius: var(
        --ck-primary-button-border-radius,
        var(--fallback-border-radius)
      );

      --hover-color: var(--ck-primary-button-hover-color, var(--color));
      --hover-background: var(
        --ck-primary-button-hover-background,
        var(--background)
      );
      --hover-box-shadow: var(
        --ck-primary-button-hover-box-shadow,
        var(--box-shadow)
      );
      --hover-border-radius: var(
        --ck-primary-button-hover-border-radius,
        var(--border-radius)
      );

      --active-color: var(--ck-primary-button-active-color, var(--hover-color));
      --active-background: var(
        --ck-primary-button-active-background,
        var(--hover-background)
      );
      --active-box-shadow: var(
        --ck-primary-button-active-box-shadow,
        var(--hover-box-shadow)
      );
      --active-border-radius: var(
        --ck-primary-button-active-border-radius,
        var(--hover-border-radius)
      );

      color: var(--color);
      background: var(--background);
      box-shadow: var(--box-shadow);
      border-radius: var(--border-radius);

      &:disabled {
        transition: 180ms ease;
        opacity: 0.4;
      }

      --bg: var(--background);
      &:not(:disabled) {
        &:hover {
          color: var(--hover-color);
          background: var(--hover-background);
          box-shadow: var(--hover-box-shadow);
          border-radius: var(--hover-border-radius);
          --bg: var(--hover-background, var(--background));
        }
        &:focus-visible {
          transition-duration: 100ms;
          color: var(--hover-color);
          background: var(--hover-background);
          box-shadow: var(--hover-box-shadow);
          border-radius: var(--hover-border-radius);
          --bg: var(--hover-background, var(--background));
        }
        &:active {
          color: var(--active-color);
          background: var(--active-background);
          box-shadow: var(--active-box-shadow);
          border-radius: var(--active-border-radius);
          --bg: var(--active-background, var(--background));
        }
      }
    `,
    ConnectorLabel: css`
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 2px 0;
      padding-right: 38px;
    `,
    ConnectorIcon: css`
      position: absolute;
      right: 20px;
      width: 32px;
      height: 32px;
      overflow: hidden;
      svg,
      img {
        display: block;
        position: relative;
        pointer-events: none;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }

      &[data-shape='squircle'] {
        border-radius: 22.5%;
      }
      &[data-shape='circle'] {
        border-radius: 100%;
      }
      &[data-shape='square'] {
        border-radius: 0;
      }
    `,
  },
  mobile: {
    ConnectorButton: css`
      text-align: center;
      background: none;
      max-width: 100%;
      overflow: hidden;
    `,
    ConnectorLabel: css`
      display: block;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
      padding: 10px 0 0;
      color: var(--ck-body-color);
      font-size: 13px;
      line-height: 15px;
      font-weight: 500;
      opacity: 0.75;
    `,
    ConnectorIcon: css`
      position: relative;
      margin: 0 auto;
      width: 60px;
      height: 60px;
      overflow: hidden;
      svg,
      img {
        display: block;
        position: relative;
        width: 100%;
        height: auto;
      }
      &[data-small='true'] {
        svg,
        img {
          transform: scale(0.8);
        }
      }

      &[data-shape='squircle'] {
        border-radius: 22.5%;
        &:before {
          content: '';
          z-index: -1;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px var(--ck-body-background-tertiary);
        }
      }
      &[data-shape='circle'] {
        border-radius: 100%;
      }
      &[data-shape='square'] {
        border-radius: 0;
      }
    `,
  },
};

export const RecentlyUsedTag = styled(motion.span)`
  position: relative;
  top: var(--ck-recent-badge-top-offset, 0.5px);
  display: inline-block;
  padding: 10px 7px;
  line-height: 0;
  font-size: 13px;
  font-weight: 400;
  border-radius: var(--ck-recent-badge-border-radius, var(--border-radius));
  color: var(
    --ck-recent-badge-color,
    var(--ck-accent-color, var(--ck-body-color-muted, currentColor))
  );
  background: var(--ck-recent-badge-background, transparent);
  overflow: hidden;
  span {
    display: inline-block;
    position: relative;
  }
  &:before {
    z-index: 1;
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.4;
    box-shadow: var(--ck-recent-badge-box-shadow, inset 0 0 0 1px currentColor);
    border-radius: inherit;
  }
  &:after {
    z-index: 2;
    content: '';
    position: absolute;
    inset: -10%;
    top: -110%;
    aspect-ratio: 1/1;
    opacity: 0.7;
    background: linear-gradient(
      170deg,
      transparent 10%,
      var(--ck-recent-badge-background, var(--bg)) 50%,
      transparent 90%
    );
    animation: ${Shimmer} 2s linear infinite;
  }
`;

export const ConnectorsContainer = styled.div<{
  $mobile?: boolean;
  $disabled?: boolean;
  $totalResults?: number;
}>`
  transition: opacity 300ms ease;
  min-width: fit-content;

  ${(props) =>
    props.$disabled &&
    css`
      pointer-events: none;
      opacity: 0.4;
    `}

  ${(props) =>
    !props.$mobile
      ? css`
          display: flex;
          flex-direction: column;
          gap: 12px;

          ${ConnectorButton} {
            ${styles.desktop.ConnectorButton}
            ${ConnectorLabel} {
              ${styles.desktop.ConnectorLabel}
            }
            ${ConnectorIcon} {
              ${styles.desktop.ConnectorIcon}
            }
          }
        `
      : css`
          display: flex;
          align-items: flex-start;
          justify-content: space-around;
          gap: 22px 6px;
          //margin: 0px -10px -20px;
          padding: 14px 0px 28px;

          ${ConnectorButton} {
            flex-shrink: 0;
            width: 80px;
            ${styles.mobile.ConnectorButton}
            ${ConnectorLabel} {
              ${styles.mobile.ConnectorLabel}
              ${RecentlyUsedTag} {
                display: none;
                width: fit-content;
                margin: 0 auto;
              }
            }
            ${ConnectorIcon} {
              ${styles.mobile.ConnectorIcon}
            }
          }
        `}
`;
