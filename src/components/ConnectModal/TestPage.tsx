import React from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import QRCode from 'react-qr-code';

const Container = styled(motion.div)`
  width: 100%;
`;
const QRCodeContainer = styled(motion.div)`
  width: 500px;
`;

const Heading = styled(motion.div)`
  text-align: center;
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  margin: 0;
  padding: 0 0 16px;
`;

const TestPage: React.FC = () => {
  return (
    <Container>
      <Heading>Scan QR Code</Heading>
      <QRCodeContainer>
        <QRCode value="https://docs.family.co/" size={500} />
      </QRCodeContainer>
    </Container>
  );
};

export default TestPage;
