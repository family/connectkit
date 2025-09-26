import styled from "../../../styles/styled";

export const FooterContainer = styled.span`
  padding: 12px 4px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  line-height: 1rem;
  color: var(--ck-body-disclaimer-color, var(--ck-body-color-muted, inherit));

  & button {
    color: var(--ck-body-disclaimer-link-color, inherit);
    font-weight: var(--ck-body-disclaimer-font-weight, 400);
    text-decoration: none;
    transition: color 200ms ease;
    &:hover {
      color: var(--ck-body-disclaimer-link-hover-color, inherit);
    }
  }
`;
