import styled from 'styled-components';

const breakpoints = [370, 290, 200];

export const WalletList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 8px;
  margin: 0 -10px -20px;
  padding: 4px 0 0;
  /*
  @media only screen and (max-width: ${breakpoints[0]}px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: ${breakpoints[1]}px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: ${breakpoints[2]}px) {
    grid-template-columns: repeat(1, 1fr);
  }
  */
`;
export const WalletItem = styled.div`
  text-align: center;
`;
export const WalletIcon = styled.div<{ $outline?: boolean }>`
  z-index: 9;
  position: relative;
  margin: 0 auto 10px;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  overflow: hidden;
  ${(props) =>
    props.$outline &&
    `
  &:before {
    content: '';
    z-index: 2;
    position: absolute;
    inset: 0;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  }`}
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
  }
`;
export const WalletLabel = styled.div`
  color: var(--body-color);
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
  opacity: 0.75;
`;

export const Container = styled.div`
  .mobile-show {
    display: none;
  }
  /*
  @media only screen and (max-width: ${breakpoints[1]}px) {
    .mobile-show {
      display: block;
    }
    .mobile-hide {
      display: none;
    }
  }
  */
`;
