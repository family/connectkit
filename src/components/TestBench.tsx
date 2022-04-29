import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled(motion.button)`
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 12px;
  background: white;
  z-index: 9999;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TestBench: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </Container>
    </AnimatePresence>
  );
};

export default TestBench;
