import styled from './../../../styles/styled';

export const LogoContainer = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  width: ${({ $width }) => $width + 'px' || '100%'};
  height: ${({ $height }) => $height + 'px' || '100%'};
`;
export const Squircle = styled.svg`
  z-index: 1;
  position: relative;
  display: block;
`;
export const Image = styled.div`
  z-index: 2;
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
  svg,
  img {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }
`;
