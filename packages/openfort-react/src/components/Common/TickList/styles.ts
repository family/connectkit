import styled from '../../../styles/styled';

export const TickListContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

export const TickItem = styled.li`
  display: flex;
  align-items: center;
  text-align: left;
  gap: 8px;
  font-size: 16px;
  line-height: 24px;
`;

export const TickIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;