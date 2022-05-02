import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const AlertContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: fit-content;
  width: 100%;
  border-radius: 8px;
  margin: 12px 0 0;
  padding: 12px 32px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: var(--body-color-danger);

  &:before {
    z-index: -1;
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0.05;
  }
`;

type AlertProps = {
  children?: React.ReactNode;
};
const Alert = React.forwardRef(
  ({ children }: AlertProps, ref: React.Ref<HTMLElement>) => {
    return <AlertContainer>{children}</AlertContainer>;
  }
);
Alert.displayName = 'Alert';

export default Alert;
