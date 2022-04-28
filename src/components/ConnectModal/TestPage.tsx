import React from 'react';
import { useContext, routes } from './../FamilyKit';
import QRCode from 'react-qr-code';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import Button from '../Button';
import { ModalHeading } from '../Modal/styles';

const Container = styled(motion.div)`
  width: 100%;
`;
const QRCodeContainer = styled(motion.div)`
  width: 500px;
`;

const TestPage: React.FC = () => {
  const context = useContext();
  return (
    <Container>
      <ModalHeading>Scan QR Code</ModalHeading>
      <QRCodeContainer>
        <QRCode value="https://docs.family.co/" size={500} />
      </QRCodeContainer>
      <Button
        onClick={() => context.setState({ open: true, route: routes.CONNECT })}
      >
        Open Connectors
      </Button>
      <Button
        onClick={() =>
          context.setState({ open: true, route: routes.KNOWLEDGEBASE })
        }
      >
        Open Knowledgebase
      </Button>
    </Container>
  );
};

export default TestPage;
