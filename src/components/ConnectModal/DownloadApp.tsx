import React, { useState } from 'react';

import styled from 'styled-components';
import { motion } from 'framer-motion';

import CustomQRCode from '../CustomQRCode';
import Button from '../Button';
import Modal, { OrDivider } from '../Modal';
import {
  ModalBody,
  ModalContent,
  ModalH1,
  ModalHeading,
} from '../Modal/styles';

import supportedConnectors from '../../constants/supportedConnectors';
import { useContext } from '../FamilyKit';
import localizations, { localize } from '../../constants/localizations';

const Container = styled(motion.div)`
  max-width: 100%;
  width: 295px;
`;

const ExternalLinkIcon = ({ ...props }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13 9.66667V12C13 13.6569 11.6569 15 10 15H4C2.34315 15 1 13.6569 1 12V6C1 4.34315 2.34315 3 4 3H6.33333"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.3"
    />
    <path
      d="M8 8L14 2L15 1M15 1V5.5M15 1H10.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.3"
    />
  </svg>
);

const DownloadApp: React.FC<{
  connectorId: string;
}> = ({ connectorId }) => {
  const context = useContext();
  const copy = localizations[context.lang].downloadAppScreen;

  const [id, setId] = useState(connectorId);
  const connector = supportedConnectors.filter((c) => c.id === id)[0];

  const localizeText = (text: string) => {
    return localize(text, {
      CONNECTORNAME: connector.name,
    });
  };
  if (!connector) return <>Connector not found</>;

  const hasApps =
    connector.appUrls && Object.keys(connector.appUrls).length !== 0;

  if (!hasApps) return <>No apps to download</>;
  return (
    <Container>
      <ModalHeading>{localizeText(copy.heading)}</ModalHeading>
      <ModalContent style={{ paddingBottom: 4, gap: 14 }}>
        <CustomQRCode value={'TODO: Download API'} image={connector.logo} />
        <ModalBody>{localizeText(copy.p)}</ModalBody>
        {connector.defaultConnect && <OrDivider />}
      </ModalContent>

      {connector.defaultConnect && ( // Open the default connector modal
        <Button
          icon={
            <ExternalLinkIcon
              style={{
                transform: 'scale(0.75)',
                left: 3,
                top: 0,
              }}
            />
          }
        >
          Open Default Modal
        </Button>
      )}
    </Container>
  );
};

export default DownloadApp;
