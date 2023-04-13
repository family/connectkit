import styled from '../../../styles/styled';

export const InputElement = styled.input`
  --color: var(--ck-input-color, var(--ck-body-color));
  --bg: var(--ck-input-background, var(--ck-body-background));
  --box-shadow: var(--ck-input-box-shadow, var(--ck-primary-button-box-shadow));
  --border-radius: var(
    --ck-input-border-radius,
    var(--ck-primary-button-border-radius)
  );

  display: block;
  width: 100%;
  padding: 12px 14px;
  padding-left: 38px;
  font-size: 15px;
  background: var(--bg);
  color: var(--color);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  transition: box-shadow 100ms ease;

  &:focus {
    box-shadow: var(--ck-input-focus-box-shadow, var(--box-shadow));
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
  color: var(--ck-body-color-muted);
`;
