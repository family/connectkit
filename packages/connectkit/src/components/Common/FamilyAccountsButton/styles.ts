import { motion } from 'framer-motion';
import styled from './../../../styles/styled';

export const ButtonContainerInner = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
  height: 100%;
`;
export const ButtonContainer = styled.button`
  --color: #ffffff;
  --background: var(--ck-family-accounts-brand);
  --box-shadow: var(--ck-primary-button-box-shadow);
  --border-radius: var(--ck-primary-button-border-radius);
  --font-weight: var(--ck-primary-button-font-weight, 500);

  --hover-color: var(--ck-button-primary-hover-color, var(--color));
  --hover-background: var(
    --ck-primary-button-hover-background,
    var(--background)
  );
  --hover-box-shadow: var(
    --ck-primary-button-hover-box-shadow,
    var(--box-shadow)
  );
  --hover-border-radius: var(
    --ck-primary-button-hover-border-radius,
    var(--border-radius)
  );
  --hover-font-weight: var(--ck-primary-button-font-weight, var(--font-weight));

  appearance: none;
  cursor: pointer;
  user-select: none;
  min-width: fit-content;
  width: 100%;
  display: block;
  text-align: center;
  height: 48px;
  margin: 12px 0 0;
  line-height: 48px;
  padding: 0 4px;
  font-size: 16px;
  font-weight: var(--font-weight, 500);
  text-decoration: none;
  white-space: nowrap;
  transition: 100ms ease;
  transition-property: box-shadow, background-color;
  color: var(--color);
  background: var(--background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  will-change: transform, box-shadow, background-color, color;
`;

export const InnerContainer = styled.div`
  transform: translateZ(0); // Shifting fix
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: calc(100% - 42px);
  transition: opacity 300ms ease;
`;

export const IconContainer = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  max-width: 20px;
  max-height: 20px;
  margin: 0 10px;
  svg {
    display: block;
    position: relative;
    max-width: 100%;
    height: auto;
  }
`;
