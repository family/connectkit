import React from 'react';
import { useContext, routes } from './../FamilyKit';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Button';

const Container = styled(motion.div)`
  width: 100%;
  min-width: 220px;
`;

const Heading = styled(motion.div)`
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  margin: 0;
  padding: 0 0 16px;
`;

const KnowledgeBase: React.FC = () => {
  const context = useContext();
  return (
    <Container>
      <Heading>Knowledgebase</Heading>
      <Button
        onClick={() => context.setState({ open: true, route: routes.CONNECT })}
      >
        Open Connectors
      </Button>
      <Button
        onClick={() => context.setState({ open: true, route: routes.TESTPAGE })}
      >
        Open QR Code
      </Button>
    </Container>
  );
};

export default KnowledgeBase;
