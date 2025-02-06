import styled from "../../../styles/styled";

export const InputContainer = styled.input`
  padding: 10px 15px;
  border-radius: var(--ck-secondary-button-border-radius);
  box-shadow: var(--ck-secondary-button-box-shadow);
  font-size: 1rem;
  color: var(--ck-body-color);
  background: var(--ck-secondary-button-hover-background);
  transition: all 0.2s;
  width: 100%;
  height: 48px;
  margin: 12px 0 0;

  &:focus {
    background: var(--ck-secondary-button-background);
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }
`
