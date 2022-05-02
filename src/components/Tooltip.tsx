import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import Portal from './Portal';

const TooltipContainer = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  top: 50%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin: 12px 0 0;
  padding: 12px 32px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: var(--body-color);
  background: var(--body-background);
`;

type TooltipProps = {
  children?: React.ReactNode;
};
const Tooltip = React.forwardRef(
  ({ children }: TooltipProps, ref: React.Ref<HTMLElement>) => {
    return (
      <Portal>
        <TooltipContainer>{children}</TooltipContainer>
      </Portal>
    );
  }
);
Tooltip.displayName = 'Tooltip';

export default Tooltip;
