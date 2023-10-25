import styled from '../../../styles/styled';

export const ScrollAreaContainer = styled.div<{
  $height?: number;
  $backgroundColor?: string;
}>`
  --bg: ${({ $backgroundColor }) =>
    $backgroundColor || 'var(--ck-body-background)'};
  --fade-height: 1px;
  position: relative;
  z-index: 1;
  max-height: ${({ $height }) => ($height ? `${$height}px` : '310px')};
  overflow-y: scroll;
  padding: 0 10px;
  margin: calc(var(--fade-height) * -1) -16px 0 -10px;

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

  &:before,
  &:after {
    pointer-events: none;
    z-index: 2;
    content: '';
    display: block;
    position: sticky;
    left: 0;
    right: 0;
    height: var(--fade-height);
    background: var(--ck-body-divider);
    box-shadow: var(--ck-body-divider-box-shadow);
    transition: opacity 300ms ease;
  }
  &:before {
    top: 0;
  }
  &:after {
    bottom: 0;
  }

  &.scroll-top {
    &:before {
      opacity: 0;
    }
  }

  &.scroll-bottom {
    &:after {
      opacity: 0;
    }
  }
`;
