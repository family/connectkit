import styled from 'styled-components';

export const WalletList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px 28px;
`;
export const WalletItem = styled.div`
  text-align: center;
`;
export const WalletIcon = styled.div`
  margin: 0 auto 10px;
  border-radius: 16px;
  width: 60px;
  height: 60px;
  overflow: hidden;
`;
export const WalletLabel = styled.div`
  color: var(--body-color-muted);
  font-size: 13px;
  line-height: 15px;
  font-weight: 500;
`;
