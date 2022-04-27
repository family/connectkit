import React from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled(motion.div)`
  width: 100%;
  min-width: 220px;
`;

const KnowledgeBase: React.FC = () => {
  return <Container>Knowledgebase</Container>;
};

export default KnowledgeBase;
