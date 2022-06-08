import styled from 'styled-components';

export const Sections = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const Section = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 18px;
  text-align: left;
  padding: 4px 8px;
`;
export const Heading = styled.div`
  color: var(--body-color);
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  padding: 0 0 8px;
`;
export const TokenGraphic = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  max-width: 48px;
  user-select: none;
  pointer-events: none;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export const Token = styled.div`
  display: block;
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 11px;
  overflow: hidden;
`;

export const Tokens = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
`;
