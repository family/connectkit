import styled from '../../../styles/styled'

export const OtherMethodButton = styled.button`
  width: 100%;
  color: var(--ck-body-color-muted);
  background: var(--ck-body-background-secondary);
  transition: color 0.2s, background 0.2s;
  font-size: 14px;
  margin-top: 10px;
  padding: 12px 16px;
  border-radius: var(--ck-secondary-button-border-radius);
  border: none;
  cursor: pointer;

  &:hover {
    color: var(--ck-body-color);
    background: var(--ck-body-background-secondary-hover-background);
  }
`
