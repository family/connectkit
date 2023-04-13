import styled from '../../../styles/styled';

export const ScrollAreaContainer = styled.div<{
  $height?: number;
  $backgroundColor?: string;
}>`
  --bg: ${({ $backgroundColor }) =>
    $backgroundColor || 'var(--ck-body-background)'};
  --fade-height: 18px;
  position: relative;
  z-index: 1;
  max-height: ${({ $height }) => ($height ? `${$height}px` : '340px')};
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
    background: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
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
  }
  &:before {
    top: -1px;
    background: linear-gradient(0deg, transparent 0%, var(--bg) 100%);
  }
  &:after {
    bottom: -1px;
    background: linear-gradient(180deg, transparent 0%, var(--bg) 100%);
  }
`;
