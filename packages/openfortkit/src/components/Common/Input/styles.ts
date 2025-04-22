import styled from "../../../styles/styled";

export const InputContainer = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  margin: 12px 0 0;
`

export const Input = styled.input`
  padding: 10px 15px;
  border-radius: var(--ck-secondary-button-border-radius);
  box-shadow: var(--ck-secondary-button-box-shadow);
  font-size: 1rem;
  color: var(--ck-body-color);
  background: var(--ck-secondary-button-hover-background);
  transition: all 0.2s;
  width: 100%;
  height: 100%;

  ::placeholder {
    color: var(--ck-body-color-muted);
  }

  &:focus {
    background: var(--ck-secondary-button-background);
    box-shadow: var(--ck-secondary-button-hover-box-shadow);
  }
`

export const IconButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 14px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ck-body-color-muted);
  transition: all 0.2s;

  > svg {
    height: 24px;
    width: 24px;
  }

  &:hover {
    color: var(--ck-body-color);
  }
`