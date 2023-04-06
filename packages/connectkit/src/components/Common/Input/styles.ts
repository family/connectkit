import styled from '../../../styles/styled';

export const InputElement = styled.input`
  display: block;
  width: 100%;
  padding: 14px;
  padding-left: 38px;
  font-size: 15px;
  background: var(--ck-body-background);
  color: currentColor;
  box-shadow: var(
    --ck-primary-button-box-shadow,
    inset 0 0 0 1px var(--ck-primary-button-background)
  );
  border-radius: var(--ck-primary-button-border-radius);

  &:focus {
    box-shadow: var(
      --ck-primary-butto-hovenr-box-shadow,
      inset 0 0 0 1px var(--ck-primary-button-hover-background)
    );
  }

  &::placeholder {
    color: var(--ck-body-color-muted);
  }
`;

export const InputContainer = styled.div`
  position: relative;
  z-index: 2;
  color: var(--ck-body-color);
`;
export const InputIcon = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
`;
