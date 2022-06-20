import styled from 'styled-components';

export const WalletList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 22px;
  padding: 8px 0;
  @media only screen and (max-width: 370px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media only screen and (max-width: 290px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: 200px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
export const WalletItem = styled.div`
  text-align: center;
`;
export const WalletIcon = styled.div`
  z-index: 9;
  margin: 0 auto 10px;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  overflow: hidden;
  svg {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
  }
`;
export const WalletLabel = styled.div`
  color: var(--body-color-muted);
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
`;
