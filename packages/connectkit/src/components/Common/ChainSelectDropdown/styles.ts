import styled from './../../../styles/styled';
import { motion } from 'framer-motion';

export const DropdownWindow = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  inset: 0;
`;
export const DropdownOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
`;
export const DropdownContainer = styled(motion.div)`
  --shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  --background: var(--ck-dropdown-background, var(--ck-tooltip-background));
  --border-radius: var(
    --ck-dropdown-border-radius,
    var(--ck-tooltip-border-radius, 12px)
  );

  pointer-events: auto;
  z-index: 2147483647;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  max-width: fit-content;
  padding: 14px 16px 16px;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
  background: var(--background);
  box-shadow: var(
    --ck-dropdown-box-shadow,
    var(--ck-tooltip-shadow, var(--shadow))
  );
  border-radius: var(--border-radius);
`;
export const DropdownHeading = styled(motion.div)`
  padding: 0 0 6px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  user-select: none;
  color: var(--ck-dropdown-color, var(--ck-tooltip-color));
`;
