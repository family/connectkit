import { css, keyframes } from 'styled-components';
import styled from '../../../styles/styled';

export const ScrollContainer = styled.div`
  position: relative;
`;
const fadeIn = keyframes`
0%{ opacity:0; }
100%{ opacity:1; }
`;

export const MoreIndicator = styled.div`
  z-index: 9;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.75rem;
  display: flex;
  justify-content: center;

  transition: opacity 300ms ease;

  span {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.3075rem 0.9375rem 0.375rem;
    border-radius: 6rem;
    background: var(--ck-tooltip-background);
    color: var(--ck-tooltip-color);
    font-weight: 500;
    font-size: 0.8125rem;
    letter-spacing: -0.01rem;
    box-shadow: var(--ck-tooltip-shadow);
    animation: ${fadeIn} 300ms ease 1000ms both;

    transition: transform 100ms ease;

    &:hover {
      transform: scale(1.02);
    }
    &:active {
      transform: scale(0.98);
    }
    svg {
      display: block;
      transform: translateX(-0.1875rem);
    }
  }

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
`;

export const ScrollAreaContainer = styled.div<{
  $mobile?: boolean;
  $height?: number;
  $backgroundColor?: string;
}>`
  --bg: ${({ $backgroundColor }) =>
    $backgroundColor || 'var(--ck-body-background)'};
  --fade-height: 1px;
  position: relative;
  z-index: 1;

  ${({ $mobile, $height, $mobileDirection }) =>
    $mobile && $mobileDirection === 'horizontal'
      ? css`
          overflow-x: scroll;
          margin: 0 -24px;
          padding: 0 24px;

          &:before,
          &:after {
            pointer-events: none;
            z-index: 10;
            content: '';
            display: block;
            position: sticky;
            top: 0;
            bottom: 0;
            width: var(--fade-height);
            background: var(
              --ck-body-divider-secondary,
              var(--ck-body-divider)
            );
            box-shadow: var(--ck-body-divider-box-shadow);
            transition: opacity 300ms ease;
          }
          &:before {
            left: 0;
          }
          &:after {
            right: 0;
          }

          &.scroll-start {
            &:before {
              opacity: 0;
            }
          }

          &.scroll-end {
            &:after {
              opacity: 0;
            }
          }
        `
      : css`
          max-height: ${$height ? `${$height}px` : '310px'};
          overflow-y: scroll;
          padding: 0 10px;
          margin: calc(var(--fade-height) * -1) -16px 0 -10px;

          &:before,
          &:after {
            pointer-events: none;
            z-index: 10;
            content: '';
            display: block;
            position: sticky;
            left: 0;
            right: 0;
            height: var(--fade-height);
            background: var(
              --ck-body-divider-secondary,
              var(--ck-body-divider)
            );
            box-shadow: var(--ck-body-divider-box-shadow);
            transition: opacity 300ms ease;
          }
          &:before {
            top: 0;
          }
          &:after {
            bottom: 0;
          }

          &.scroll-start {
            &:before {
              opacity: 0;
            }
          }

          &.scroll-end {
            &:after {
              opacity: 0;
            }
          }
        `}

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: var(--ck-body-color-muted);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ck-body-color-muted-hover);
  }
`;
