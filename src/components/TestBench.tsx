import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import Portal from './Portal';

const Container = styled(motion.div)`
  z-index: 2147483647;
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TestBench: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence>
      <Portal>
        <Container
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </Container>
      </Portal>
    </AnimatePresence>
  );
};

export default TestBench;
