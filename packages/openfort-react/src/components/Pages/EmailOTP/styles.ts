import styled from '../../../styles/styled'

export const Body = styled.p`
  color: var(--ck-body-color);
  text-align: center;
  margin-bottom: 16px;
`

export const ResultContainer = styled.div`
  margin-top: 16px;
  height: 24px;
  text-align: center;
`

export const FooterButtonText = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--ck-body-color-muted);
  transition: color 0.3s;

  &:disabled {
    color: var(--ck-body-color-muted) !important;
    cursor: not-allowed;
  }
`

export const FooterTextButton = styled.p`
  color: var(--ck-body-color-muted);
  text-align: center;
  margin-top: 16px;
  &:hover {
    ${FooterButtonText} {
      color: var(--ck-body-color);
    }
  }
`
